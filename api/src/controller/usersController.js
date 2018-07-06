const User = require('../model/user');
const Sequelize = require('sequelize');
const BCrypt = require('bcrypt-nodejs');
const Joi = require('joi');

const POST_USERS_VALIDATION = Joi.object().keys({
    email: Joi.string().email(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).max(50).required(),
});

module.exports.postUsers = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const validation = Joi.validate({ email, username, password }, POST_USERS_VALIDATION);

        if (validation.error) {
            res.status(403).json({ error: validation.error.details[0].message });
        } else {
            const exists = await User.findOne({ where: Sequelize.or({ email }, { username }) });

            if (exists) {
                res.status(403).json({ error: 'This email or username is already used.' });
            } else {
                const salt = BCrypt.genSaltSync(10);
                const encryptedPassword = BCrypt.hashSync(password, salt, undefined);

                await User.create({ email, username, password: encryptedPassword });

                res.status(201).json({});
            }
        }
    } catch (error) {
        console.error('An error occurred!');
        console.error(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

module.exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        const content = [];

        users.forEach((user) => {
            content.push({
                id: user.id,
                email: user.email,
                username: user.username,
                description: user.description,
                created_at: user.createdAt.getTime(),
            });
        });

        res.json(content);
    } catch (error) {
        console.error('An error occurred!');
        console.error(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

module.exports.getUserByNameOrId = async (req, res) => {
    try {
        const param = req.params.name;
        const field = param.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? 'id' : 'username';
        const user = await User.findOne({ where: { [field]: { [Sequelize.Op.like]: param } } });

        if (user) {
            res.json({
                id: user.id,
                email: user.email,
                username: user.username,
                description: user.description,
                created_at: user.createdAt.getTime(),
            });
        } else {
            res.status(404).json({});
        }
    } catch (error) {
        console.error('An error occurred!');
        console.error(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

module.exports.getUserProjectsByNameOrId = async (req, res) => {
    try {
        const param = req.params.name;
        const field = param.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? 'id' : 'username';
        const user = await User.findOne({
            where: { [field]: { [Sequelize.Op.like]: param } },
        });

        if (user) {
            const projects = await user.getProjects();
            const content = [];

            projects.forEach((project) => {
                content.push({
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    owner_id: project.userId,
                    port: project.port,
                    updated_at: project.updatedAt.getTime(),
                    created_at: project.createdAt.getTime(),
                });
            });

            res.json(content);
        } else {
            res.status(404).json({});
        }
    } catch (error) {
        console.error('An error occurred!');
        console.error(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

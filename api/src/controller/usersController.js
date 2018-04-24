const User = require('../model/user');
const Sequelize = require('sequelize');
const BCrypt = require('bcrypt-nodejs');
const Joi = require('joi');

const POST_USERS_VALIDATION = Joi.object().keys({
    email: Joi.string().email(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).max(50).required(),
});

module.exports.postUsers = (req, res) => {
    const { email, username, password } = req.body;
    const validation = Joi.validate({ email, username, password }, POST_USERS_VALIDATION);

    if (validation.error) {
        return res.status(403).json({ error: validation.error.details[0].message });
    }

    User.findOne({ where: Sequelize.or({ email }, { username }) })
        .then((exists) => {
            if (exists) {
                return res.status(403).json({ error: 'This email or username is already used.' });
            }
            const salt = BCrypt.genSaltSync(10);
            const encryptedPassword = BCrypt.hashSync(password, salt, undefined);

            return User.create({ email, username, password: encryptedPassword })
                .then(() => {
                    res.status(201).json({});
                });
        })
        .catch((error) => {
            console.error('An error occurred!');
            console.error(error);
            res.status(500).json({ error: 'An error occurred. Please retry later.' });
        });
};

module.exports.getUsers = (req, res) => {
    User.findAll()
        .then((users) => {
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
        })
        .catch((error) => {
            console.error('An error occurred!');
            console.error(error);
            res.status(500).json({ error: 'An error occurred. Please retry later.' });
        });
};

module.exports.getUserByNameOrId = (req, res) => {
    const param = req.params.name;
    const field = param.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? 'id' : 'username';
    User.findOne({ where: { [field]: { [Sequelize.Op.like]: param } } })
        .then((user) => {
            if (user) {
                return res.json({
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    description: user.description,
                    created_at: user.createdAt.getTime(),
                });
            }
            res.status(404).json({});
        })
        .catch((error) => {
            console.error('An error occurred!');
            console.error(error);
            res.status(500).json({ error: 'An error occurred. Please retry later.' });
        });
};

module.exports.getUserProjectsByNameOrId = (req, res) => {
    const param = req.params.name;
    const field = param.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? 'id' : 'username';
    User.findOne({ where: { [field]: { [Sequelize.Op.like]: param } } })
        .then((user) => {
            if (user) {
                return user.getProjects()
                    .then((projects) => {
                        const content = [];
                        projects.forEach((project) => {
                            content.push({
                                id: project.id,
                                name: project.name,
                                description: project.description,
                                owner_id: project.userId,
                                updated_at: project.updatedAt.getTime(),
                                created_at: project.createdAt.getTime(),
                            });
                        });
                        res.json(content);
                    });
            }
            res.status(404).json({});
        })
        .catch((error) => {
            console.error('An error occurred!');
            console.error(error);
            res.status(500).json({ error: 'An error occurred. Please retry later.' });
        });
};

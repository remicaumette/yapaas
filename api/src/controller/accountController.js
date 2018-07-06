const User = require('../model/user');
const { fatal } = require('signale');

module.exports.getAccount = (req, res) => {
    const {
        id, email, username, description, createdAt,
    } = req.user;

    res.json({
        id, email, username, description, created_at: createdAt.getTime(),
    });
};

module.exports.putAccount = async (req, res) => {
    try {
        const { description } = req.body;
        await User.update({ description }, { where: { id: req.user.id } });

        res.json({});
    } catch (error) {
        fatal('An error occurred!');
        fatal(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

module.exports.deleteAccount = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.user.id } });
        res.json({});
    } catch (error) {
        fatal('An error occurred!');
        fatal(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

module.exports.getAccountProjects = async (req, res) => {
    try {
        const projects = await req.user.getProjects();
        const content = [];

        projects.forEach((project) => {
            content.push({
                id: project.id,
                name: project.name,
                description: project.description,
                owner_id: project.userId,
                port: project.port,
                runtime: project.runtime,
                updated_at: project.updatedAt.getTime(),
                created_at: project.createdAt.getTime(),
            });
        });

        res.json(content);
    } catch (error) {
        fatal('An error occurred!');
        fatal(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

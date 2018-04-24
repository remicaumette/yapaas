const Project = require('../model/project');
const Sequelize = require('sequelize');
const Joi = require('joi');

const POST_PROJECTS_VALIDATION = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required(),
    description: Joi.string().min(20).max(2000).required(),
});

const PUT_PROJECTS_VALIDATION = Joi.object().keys({
    description: Joi.string().min(20).max(2000).required(),
});

module.exports.postProjects = (req, res) => {
    const { name, description } = req.body;
    const user = req.user;
    const validation = Joi.validate({ name, description }, POST_PROJECTS_VALIDATION);

    if (validation.error) {
        return res.status(403).json({ error: validation.error.details[0].message });
    }

    Project.findOne({ where: { name } })
        .then((exists) => {
            if (exists) {
                return res.status(403).json({ error: 'This project name is already used.' });
            }
            return Project.create({ name, description, userId: user.id })
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

module.exports.getProjects = (req, res) => {
    Project.findAll()
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
        })
        .catch((error) => {
            console.error('An error occurred!');
            console.error(error);
            res.status(500).json({ error: 'An error occurred. Please retry later.' });
        });
};

module.exports.getProjectByNameOrId = (req, res) => {
    const param = req.params.name;
    const field = param.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? 'id' : 'name';
    Project.findOne({ where: { [field]: { [Sequelize.Op.like]: param } } })
        .then((project) => {
            if (project) {
                return res.json({
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    owner_id: project.userId,
                    updated_at: project.updatedAt.getTime(),
                    created_at: project.createdAt.getTime(),
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

module.exports.putProjectByNameOrId = (req, res) => {
    const { description } = req.body;
    const validation = Joi.validate({ description }, PUT_PROJECTS_VALIDATION);
    const param = req.params.name;
    const field = param.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? 'id' : 'name';

    if (validation.error) {
        return res.status(403).json({ error: validation.error.details[0].message });
    }

    Project.findOne({ where: { [field]: { [Sequelize.Op.like]: param } } })
        .then((project) => {
            if (project) {
                if (req.user.admin || project.userId === req.user.id) {
                    project.description = description;
                    return project.save()
                        .then(() => res.status(200).json({}));
                }
                return res.status(403).json({});
            }
            res.status(404).json({});
        })
        .catch((error) => {
            console.error('An error occurred!');
            console.error(error);
            res.status(500).json({ error: 'An error occurred. Please retry later.' });
        });
};


module.exports.deleteProjectByNameOrId = (req, res) => {
    const param = req.params.name;
    const field = param.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? 'id' : 'name';

    Project.findOne({ where: { [field]: { [Sequelize.Op.like]: param } } })
        .then((project) => {
            if (project) {
                if (req.user.admin || project.userId === req.user.id) {
                    return project.destroy()
                        .then(() => res.status(200).json({}));
                }
                return res.status(403).json({});
            }
            res.status(404).json({});
        })
        .catch((error) => {
            console.error('An error occurred!');
            console.error(error);
            res.status(500).json({ error: 'An error occurred. Please retry later.' });
        });
};

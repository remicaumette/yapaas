const Project = require('../model/project');
const Joi = require('joi');

const POST_PROJECTS_VALIDATION = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required(),
    description: Joi.string().min(20).max(2000),
});

module.exports.postProjects = (req, res) => {
    const { name, description } = req.body;
    const validation = Joi.validate({ name, description }, POST_PROJECTS_VALIDATION);

    if (validation.error) {
        return res.status(403).json({ error: validation.error.details[0].message });
    }

    Project.findOne({ where: { name } })
        .then((exists) => {
            if (exists) {
                return res.status(403).json({ error: 'This project name is already used.' });
            }

            return Project.create({ name, description })
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

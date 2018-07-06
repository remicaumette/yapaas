const Project = require('../model/project');
const Sequelize = require('sequelize');
const Joi = require('joi');
const path = require('path');
const deployer = require('../deployer');
const { fatal } = require('signale');

const RUNTIMES = ['php', 'static'];

const POST_PROJECTS_VALIDATION = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required(),
    runtime: Joi.string().valid(RUNTIMES).required(),
    description: Joi.string().min(20).max(2000).required(),
});

const PUT_PROJECTS_VALIDATION = Joi.object().keys({
    description: Joi.string().min(20).max(2000).required(),
});

module.exports.postProjects = async (req, res) => {
    try {
        const { name, runtime, description } = req.body;
        const user = req.user;
        const validation = Joi.validate({ name, runtime, description }, POST_PROJECTS_VALIDATION);

        if (validation.error) {
            res.status(403).json({ error: validation.error.details[0].message });
        } else {
            const exists = await Project.findOne({ where: { name } });

            if (exists) {
                res.status(403).json({ error: 'This project name is already used.' });
            } else {
                await Project.create({ name, description, runtime, userId: user.id });
                res.status(201).json({});
            }
        }
    } catch (error) {
        fatal('An error occurred!');
        fatal(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

module.exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll();
        const content = [];

        projects.forEach((project) => {
            content.push({
                id: project.id,
                name: project.name,
                description: project.description,
                owner_id: project.userId,
                runtime: project.runtime,
                port: project.port,
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

module.exports.getProjectByNameOrId = async (req, res) => {
    try {
        const param = req.params.name;
        const field = param.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? 'id' : 'name';
        const project = await Project.findOne({
            where: { [field]: { [Sequelize.Op.like]: param } },
        });

        if (project) {
            res.json({
                id: project.id,
                name: project.name,
                description: project.description,
                owner_id: project.userId,
                runtime: project.runtime,
                port: project.port,
                updated_at: project.updatedAt.getTime(),
                created_at: project.createdAt.getTime(),
            });
        } else {
            res.status(404).json({});
        }
    } catch (error) {
        fatal('An error occurred!');
        fatal(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

module.exports.putProjectByNameOrId = async (req, res) => {
    try {
        const { description } = req.body;
        const validation = Joi.validate({ description }, PUT_PROJECTS_VALIDATION);
        const param = req.params.name;
        const field = param.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? 'id' : 'name';

        if (validation.error) {
            res.status(403).json({ error: validation.error.details[0].message });
        } else {
            const project = await Project.findOne({
                where: { [field]: { [Sequelize.Op.like]: param } },
            });

            if (project) {
                if (req.user.admin || project.userId === req.user.id) {
                    project.description = description;
                    await project.save();

                    res.status(200).json({});
                } else {
                    res.status(403).json({});
                }
            } else {
                res.status(404).json({});
            }
        }
    } catch (error) {
        fatal('An error occurred!');
        fatal(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};


module.exports.deleteProjectByNameOrId = async (req, res) => {
    try {
        const param = req.params.name;
        const field = param.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? 'id' : 'name';
        const project = await Project.findOne({
            where: { [field]: { [Sequelize.Op.like]: param } },
        });

        if (project) {
            if (req.user.admin || project.userId === req.user.id) {
                await Promise.all([
                    deployer.destroy(project),
                    project.destroy(),
                ]);

                res.status(200).json({});
            } else {
                res.status(403).json({});
            }
        } else {
            res.status(404).json({});
        }
    } catch (error) {
        fatal('An error occurred!');
        fatal(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

module.exports.uploadProjectByNameOrId = async (req, res) => {
    try {
        const param = req.params.name;
        const field = param.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? 'id' : 'name';
        const { file } = req.files;

        if (!req.files || !file || path.extname(file.name) !== '.zip') {
            res.status(403).json({ error: 'Invalid upload.' });
        } else {
            const project = await Project.findOne({
                where: { [field]: { [Sequelize.Op.like]: param } },
            });

            if (project) {
                if (req.user.admin || project.userId === req.user.id) {
                    await deployer.deploy(project, file);

                    res.status(200).json({});
                } else {
                    res.status(403).json({});
                }
            } else {
                res.status(404).json({});
            }
        }
    } catch (error) {
        fatal('An error occurred!');
        fatal(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

const Project = require('../model/project');

module.exports = {
    async projects({ id }) {
        const projects = await Project.findAll({ where: { userId: id } });
        return projects
            .map(project => project.serialize());
    },
};

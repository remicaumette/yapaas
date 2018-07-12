const Project = require('../model/project');

module.exports = {
    async projects({ id }) {
        const projects = await Project.findAll({ where: { userId: id } });
        return projects
            .map(project => project.serialize());
    },
    async admin({ username }) {
        const admins = process.env.ADMIN.trim().split(',').map(admin => admin.toLowerCase());

        if (admins.includes(username.toLowerCase())) {
            return true;
        }

        return false;
    },
};

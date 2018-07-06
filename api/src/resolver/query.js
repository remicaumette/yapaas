const User = require('../model/user');
const Project = require('../model/project');

module.exports = {
    async me() {
        console.log('ok');
    },
    async users(_, { page, limit }) {
        const users = await User.findAll({ order: [['createdAt', 'DESC']], limit, offset: limit * (page - 1) });
        return users
            .map(user => user.serialize());
    },
    async userById(_, { id }) {
        const user = await User.findOne({ where: { id } });
        return user ? user.serialize() : null;
    },
    async userByName(_, { name }) {
        const user = await User.findOne({ where: { username: name } });
        return user ? user.serialize() : null;
    },
    async projects(_, { page, limit }) {
        const projects = await Project.findAll({ order: [['createdAt', 'DESC']], limit, offset: limit * (page - 1) });
        return projects
            .map(project => project.serialize());
    },
    async projectById(_, { id }) {
        const project = await Project.findOne({ where: { id } });
        return project ? project.serialize() : null;
    },
    async projectByName(_, { name }) {
        const project = await Project.findOne({ where: { name } });
        return project ? project.serialize() : null;
    },
};

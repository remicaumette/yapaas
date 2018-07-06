const Project = require('../model/project');
const User = require('../model/user');

module.exports = {
    async owner({ id }) {
        const project = await Project.findOne({ where: { id } });
        const user = await User.findById(project.userId);

        return user.serialize();
    },
};

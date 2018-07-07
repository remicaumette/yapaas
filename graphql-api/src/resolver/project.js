const Project = require('../model/project');
const User = require('../model/user');
const Deployer = require('../deployer');

module.exports = {
    async owner({ id }) {
        const project = await Project.findOne({ where: { id } });
        const user = await User.findById(project.userId);

        return user.serialize();
    },
    async port({ id }) {
        return Deployer.getPort(id);
    },
};

const Project = require('../model/project');
const User = require('../model/user');
const Deployer = require('../deployer');

module.exports = {
    async owner({ id }) {
        const project = await Project.findOne({ where: { id } });
        const user = await User.findById(project.userId);

        return user.serialize();
    },
    async url({ id }) {
        const port = await Deployer.getPort(id);
        return port ? `http://${process.env.BASE_URL || 'localhost'}:${port}` : null;
    },
};

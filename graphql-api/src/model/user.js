const Sequelize = require('sequelize');
const uuid = require('uuid');
const db = require('../database');
const Project = require('./project');

const User = db.define('users', {
    id: {
        type: Sequelize.UUID,
        defaultValue: uuid.v4,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING,
    },
    username: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
    },
    description: {
        type: Sequelize.STRING,
    },
}, {
    hooks: {
        async beforeDestroy(instance, options, cb) {
            await Project.destroy({ where: { userId: instance.id } });
            return cb();
        },
        async beforeBulkDestroy({ where }) {
            const users = await User.findAll({ where });
            await Promise.all(users.map(async user =>
                Project.destroy({ where: { userId: user.id } })));
        },
    },
});

User.prototype.serialize = function serialize() {
    return {
        id: this.id,
        email: this.email,
        username: this.username,
        description: this.description,
        updatedAt: this.updatedAt,
        createdAt: this.createdAt,
    };
};

module.exports = User;

const Sequelize = require('sequelize');
const uuid = require('uuid');
const db = require('../database');
const deployer = require('../deployer');

const Project = db.define('projects', {
    id: {
        type: Sequelize.UUID,
        defaultValue: uuid.v4,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
    },
    description: {
        type: Sequelize.STRING,
    },
    runtime: {
        type: Sequelize.STRING,
    },
    ownerId: {
        type: Sequelize.UUID,
    },
}, {
    hooks: {
        async beforeDestroy(instance, options, cb) {
            await deployer.destroy(instance);
            return cb();
        },
        async beforeBulkDestroy({ where }) {
            const projects = await Project.findAll({ where });
            await Promise.all(projects.map(deployer.destroy));
        },
    },
});

Project.prototype.serialize = function serialize() {
    return {
        id: this.id,
        name: this.name,
        description: this.description,
        runtime: this.runtime.toUpperCase(),
        port: this.port,
        updatedAt: this.updatedAt,
        createdAt: this.createdAt,
    };
};

module.exports = Project;

const Sequelize = require('sequelize');
const uuid = require('uuid');
const db = require('../database');

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
    port: {
        type: Sequelize.STRING,
    },
    ownerId: {
        type: Sequelize.UUID,
    },
});

Project.prototype.serialize = function serialize() {
    return {
        id: this.id,
        name: this.name,
        description: this.description,
        runtime: this.runtime,
        port: this.port,
        updatedAt: this.updatedAt,
        createdAt: this.createdAt,
    };
};

module.exports = Project;

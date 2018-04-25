const Sequelize = require('sequelize');
const uuid = require('uuid');
const db = require('../database');

module.exports = db.define('projects', {
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
    imageId: {
        type: Sequelize.STRING,
    },
    url: {
        type: Sequelize.STRING,
    },
});

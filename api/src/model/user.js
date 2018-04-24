const Sequelize = require('sequelize');
const uuid = require('uuid');
const db = require('../database');

module.exports = db.define('user', {
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
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: () => new Date(),
    },
});

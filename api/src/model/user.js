const Sequelize = require('sequelize');
const uuid = require('uuid');
const db = require('../database');

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
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
});

User.prototype.serialize = function serialize() {
    return {
        id: this.id,
        email: this.email,
        username: this.username,
        description: this.description,
        admin: this.admin,
        updatedAt: this.updatedAt,
        createdAt: this.createdAt,
    };
};

module.exports = User;

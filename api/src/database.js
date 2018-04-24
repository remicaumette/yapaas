const Sequelize = require('sequelize');
const path = require('path');

const db = process.env.NODE_ENV === 'production' ?
    new Sequelize(process.env.DB_URI, { operatorsAliases: false, logging: false }) :
    new Sequelize({
        dialect: 'sqlite',
        operatorsAliases: false,
        storage: process.env.NODE_ENV === 'test' ? ':memory:' : path.join(__dirname, '..', 'database.db'),
        logging: process.env.NODE_ENV !== 'test',
    });

module.exports = db;

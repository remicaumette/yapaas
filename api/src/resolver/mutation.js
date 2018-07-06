const { GraphQLError } = require('graphql');
const Joi = require('joi');
const Sequelize = require('sequelize');
const BCrypt = require('bcrypt-nodejs');
const Project = require('../model/project');
const User = require('../model/user');
const Auth = require('../util/auth');

const CREATE_USER_VALIDATION = Joi.object().keys({
    email: Joi.string().email(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).max(50).required(),
});

module.exports = {
    async createUser(_, { email, username, password }) {
        const validation = Joi.validate({ email, username, password }, CREATE_USER_VALIDATION);

        if (validation.error) {
            throw new GraphQLError(validation.error.details[0].message);
        }

        const exists = await User.findOne({ where: Sequelize.or({ email }, { username }) });

        if (exists) {
            throw new GraphQLError('This email or username is already used.');
        }

        const salt = BCrypt.genSaltSync(10);
        const encryptedPassword = BCrypt.hashSync(password, salt, undefined);
        const user = await User.create({ email, username, password: encryptedPassword });

        return user.serialize();
    },
    async updateUser(_, { id, description }) {
        const user = await User.findById(id);
        user.description = description;
        await user.save();

        return user.serialize();
    },
    async deleteUser(_, { id }) {
        return User.destroy({ where: { id } });
    },
    async createToken(_, { email, password }) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new GraphQLError('Invalid email or password.');
        }

        const match = await Auth.comparePassword(password, user.password);

        if (!match) {
            throw new GraphQLError('Invalid email or password.');
        }

        return Auth.createToken(user.id);
    },
    async createProject(_, { name, runtime }) {
        // console.log(arguments, name, runtime);
    },
};

const User = require('../model/user');
const Sequelize = require('sequelize');
const BCrypt = require('bcrypt-nodejs');
const Joi = require('joi');

const USER_VALIDATION = Joi.object().keys({
    email: Joi.string().email(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).max(50).required(),
});

module.exports.postUser = (req, res) => {
    const { email, username, password } = req.body;
    const validation = Joi.validate({ email, username, password }, USER_VALIDATION);

    if (validation.error) {
        return res.status(403).json({ error: validation.error.details[0].message });
    }

    User.findOne({ where: Sequelize.or({ email }, { username }) })
        .then((exists) => {
            if (exists) {
                return res.status(403).json({ error: 'This email or username is already used.' });
            }
            const salt = BCrypt.genSaltSync(10);
            const encryptedPassword = BCrypt.hashSync(password, salt, undefined);

            return User.create({ email, username, password: encryptedPassword })
                .then(() => {
                    res.status(201).json({});
                });
        })
        .catch((error) => {
            console.error('An error occurred!');
            console.error(error);
            res.status(500).json({ error: 'An error occurred. Please retry later.' });
        });
};

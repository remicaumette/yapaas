const Jwt = require('jsonwebtoken');
const User = require('../model/user');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (token) {
        return new Promise((resolve, reject) => {
            Jwt.verify(token, process.env.SECRET || 'wowthisismysecret', (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        }).then(data => User.findOne({ where: { id: data.user } }).then((user) => {
            req.user = user;
            next();
        })).catch((error) => {
            console.error('An error occurred!');
            console.error(error);
            res.status(500).json({ error: 'An error occurred. Please retry later.' });
        });
    }
    res.status(404).json({});
};

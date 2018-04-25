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
            if (user) {
                req.user = user;
                return next();
            }
            res.status(404).json({});
        })).catch(() => {
            res.status(404).json({});
        });
    }
    res.status(404).json({});
};

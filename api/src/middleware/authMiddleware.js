const Jwt = require('jsonwebtoken');
const User = require('../model/user');

function getTokenContent(token) {
    return new Promise((resolve, reject) => {
        Jwt.verify(token, process.env.SECRET || 'wowthisismysecret', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (token) {
            const data = await getTokenContent(token);
            const user = await User.findOne({ where: { id: data.user } });

            if (user) {
                req.user = user;
                next();
            } else {
                res.status(404).json({});
            }
        } else {
            res.status(404).json({});
        }
    } catch (error) {
        res.status(404).json({});
    }
};

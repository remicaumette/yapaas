const User = require('../model/user');
const BCrypt = require('bcrypt-nodejs');
const Jwt = require('jsonwebtoken');

module.exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ where: { email } })
        .then((user) => {
            if (user) {
                return new Promise((resolve, reject) => {
                    BCrypt.compare(password, user.password, (error, match) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(match);
                        }
                    });
                }).then((match) => {
                    if (match) {
                        return new Promise((resolve, reject) => {
                            Jwt.sign({ user: user.id, created_at: Date.now() }, process.env.SECRET || 'wowthisismysecret', (error, token) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(token);
                                }
                            });
                        }).then((token) => {
                            res.json({ token });
                        });
                    }
                    res.status(403).json({ error: 'Invalid email or password.' });
                });
            }
            res.status(403).json({ error: 'Invalid email or password.' });
        })
        .catch((error) => {
            console.error('An error occurred!');
            console.error(error);
            res.status(500).json({ error: 'An error occurred. Please retry later.' });
        });
};

const User = require('../model/user');
const BCrypt = require('bcrypt-nodejs');
const Jwt = require('jsonwebtoken');
const { fatal } = require('signale');

function comparePassword(password1, password2) {
    return new Promise((resolve, reject) => {
        BCrypt.compare(password1, password2, (error, ok) => {
            if (error) {
                reject(error);
            } else {
                resolve(ok);
            }
        });
    });
}

function createToken(id) {
    return new Promise((resolve, reject) => {
        Jwt.sign({ user: id, created_at: Date.now() }, process.env.SECRET || 'wowthisismysecret', (error, ok) => {
            if (error) {
                reject(error);
            } else {
                resolve(ok);
            }
        });
    });
}

module.exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (user) {
            const match = await comparePassword(password, user.password);

            if (match) {
                const token = await createToken(user.id);
                res.json({ token });
            } else {
                res.status(403).json({ error: 'Invalid email or password.' });
            }
        } else {
            res.status(403).json({ error: 'Invalid email or password.' });
        }
    } catch (error) {
        fatal('An error occurred!');
        fatal(error);
        res.status(500).json({ error: 'An error occurred. Please retry later.' });
    }
};

const Jwt = require('jsonwebtoken');
const BCrypt = require('bcrypt-nodejs');

module.exports = {
    getTokenContent(token) {
        return new Promise((resolve, reject) => {
            Jwt.verify(token, process.env.SECRET || 'wowthisismysecret', (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    },
    comparePassword(password1, password2) {
        return new Promise((resolve, reject) => {
            BCrypt.compare(password1, password2, (error, ok) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(ok);
                }
            });
        });
    },
    createToken(id) {
        return new Promise((resolve, reject) => {
            Jwt.sign({ user: id, created_at: Date.now() }, process.env.SECRET || 'wowthisismysecret', (error, ok) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(ok);
                }
            });
        });
    },
};

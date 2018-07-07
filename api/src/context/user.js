const User = require('../model/user');
const Auth = require('../directive/auth');
const { fatal } = require('signale');

module.exports = async (req) => {
    try {
        const token = req.header('Authorization');

        if (token) {
            const data = await Auth.getTokenContent(token);

            if (data) {
                const user = await User.findOne({ where: { id: data.user } });

                if (user) {
                    return user;
                }
            }
        }
    } catch (error) {
        fatal(error);
    }
};

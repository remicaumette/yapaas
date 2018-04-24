const User = require('../model/user');

module.exports.getAccount = (req, res) => {
    res.json(req.user);
};

module.exports.deleteAccount = (req, res) => {
    User.destroy({ where: { id: req.user.id } })
        .then(() => res.json({}))
        .catch((error) => {
            console.error('An error occurred!');
            console.error(error);
            res.status(500).json({ error: 'An error occurred. Please retry later.' });
        });
};

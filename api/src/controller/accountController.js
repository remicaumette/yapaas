const User = require('../model/user');

module.exports.getAccount = (req, res) => {
    const {
        id, email, username, description, createdAt,
    } = req.user;

    res.json({
        id, email, username, description, created_at: createdAt.getTime(),
    });
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

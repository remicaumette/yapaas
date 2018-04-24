module.exports.getAccount = (req, res) => {
    res.json(req.user);
};

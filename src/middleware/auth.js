module.exports = async (req, res, next) => {
    if (req.user) return next();

    return res.status(401).send('User is not logged in');
};

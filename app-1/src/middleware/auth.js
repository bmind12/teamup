const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await User.findOne({ 'tokens.token': token });
        const decodedToken = jwt.verify(token, user.salt);

        if (user._id.toString() !== decodedToken._id) throw new Error();

        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        res.status(401).send('Token is invalid');
    }
};

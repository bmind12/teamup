const User = require('../models/User');

const DUPLICATE_KEY_ERROR_CODE = 11000;

module.exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);

        res.statusCode = 201;
        res.send(user);
    } catch (err) {
        if (err.code === DUPLICATE_KEY_ERROR_CODE) {
            res.statusCode = 409;
            res.body = 'Email already exists';
        } else {
            res.statusCode = 400;
        }

        res.end();
    }
};

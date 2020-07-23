const mongoose = require('mongoose');
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

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.statusCode = 400;

        return res.send('User id should be provided');
    }

    if (!mongoose.isValidObjectId(id)) {
        res.statusCode = 400;

        return res.send('User id is invalid');
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        res.statusCode = 400;

        return res.send(`User with id: ${id} was not found`);
    }

    res.end();
};

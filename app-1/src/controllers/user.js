const mongoose = require('mongoose');
const User = require('../models/User');

const DUPLICATE_KEY_ERROR_CODE = 11000;

module.exports.createUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = new User({ email });

        await user.setPassword(password);
        await user.save();

        res.status(201).send(user);
    } catch (err) {
        if (err.code === DUPLICATE_KEY_ERROR_CODE) {
            return res.status(409).send('Email already exists');
        }

        return res.status(400).send('An error occured');
    }
};

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).send('User id should be provided');

    if (!mongoose.isValidObjectId(id))
        return res.status(400).send('User id is invalid');

    const user = await User.findByIdAndDelete(id);

    if (!user) return res.status(400).send(`User with id: ${id} was not found`);

    return res.end();
};

const User = require('../models/User');
const { authenticateLocal } = require('../libs/passport');

const DUPLICATE_KEY_ERROR_CODE = 11000;

module.exports.createUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = new User({ email });

        await user.setPassword(password);
        await user.save();

        authenticateLocal(req, res, () => res.status(201).send({ user }));
    } catch (err) {
        if (err.code === DUPLICATE_KEY_ERROR_CODE) {
            return res.status(409).send('Email already exists');
        }

        return res.status(400).send('An error occured');
    }
};

module.exports.deleteUser = async (req, res) => {
    const user = await req.user.remove();

    return res.send(user);
};

module.exports.loginUser = async (req, res) => {
    res.send({ user: req.user });
};

module.exports.logout = async (req, res) => {
    const { user, session } = req;

    session.destroy();

    res.send({ user });
};

const User = require('../models/User');

module.exports.createUser = async (req, res) => {
    const user = await User.create(req.body);

    res.send(user);
};

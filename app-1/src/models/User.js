const mongoose = require('mongoose');
const connection = require('../libs/connection');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = connection.model('User', userSchema);

module.exports = User;

const crypto = require('crypto');
const mongoose = require('mongoose');
const connection = require('../libs/connection');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

userSchema.methods.setPassword = async function (password) {
    this.salt = await generateSalt();
    this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.methods.checkPassword = async function (password) {
    if (!password) return false;

    const hash = await generatePassword(this.salt, password);
    return hash === this.passwordHash;
};

function generateSalt() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(+process.env.CRYPTO_LENGTH, (err, buffer) => {
            if (err) return reject(err);

            resolve(buffer.toString('hex'));
        });
    });
}

function generatePassword(salt, password) {
    return new Promise((resolve, reject) => {
        return crypto.pbkdf2(
            password,
            salt,
            +process.env.CRYPTO_ITERATIONS,
            +process.env.CRYPTO_LENGTH,
            process.env.CRYPTO_DIGEST,
            (err, key) => {
                if (err) return reject(err);

                resolve(key.toString('hex'));
            }
        );
    });
}

const User = connection.model('User', userSchema);

module.exports = User;

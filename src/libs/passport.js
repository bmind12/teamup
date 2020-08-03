const passport = require('passport');
const localStrategy = require('./strategies/local');
const User = require('../models/User');

passport.use(localStrategy);
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);

        done(null, user);
    } catch (err) {
        done(error, null);
    }
});

module.exports.authenticateLocal = passport.authenticate('local');
module.exports.passport = passport;

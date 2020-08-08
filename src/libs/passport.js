import passport from 'passport';
import localStrategy from './strategies/local';
import User from '../models/User';

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

export const authenticateLocal = passport.authenticate('local');

export default passport;

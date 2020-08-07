import { Strategy as LocalStrategy } from 'passport-local';
import User from '../../models/User';

const localStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password'
};

export default new LocalStrategy(localStrategyOptions, async function (
    email,
    password,
    done
) {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        const isValidPassword = await user.isValidPassword(password);

        if (!isValidPassword) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
    } catch (err) {
        console.error(err);
        done(err);
    }
});

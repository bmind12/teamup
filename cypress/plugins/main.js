import 'config';
import User from 'models/User';

async function cleanUsers() {
    await User.deleteMany();

    return null;
}

async function seedUser(user) {
    await User.createUser(user.email, user.password);

    return null;
}

export default (on) => {
    on('task', {
        'clean:users'() {
            return cleanUsers();
        },
        'seed:user'(user) {
            return seedUser(user);
        }
    });
};

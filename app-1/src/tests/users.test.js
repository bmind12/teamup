const request = require('supertest');
const connection = require('../libs/connection');
const User = require('../models/User');
const app = require('../app');

const newUser = {
    email: 'email@email.email',
    password: 'test1234'
};

const newInclompleteUser = {
    email: 'email@email.email'
};

beforeAll(async () => {
    await User.deleteMany();
});

afterAll(() => {
    connection.close();
});

describe('POST /users', () => {
    afterAll(async () => {
        await User.deleteMany({});
    });

    it('Should register user', async (done) => {
        await request(app).post('/users').send(newUser).expect(201);

        const user = await User.findOne({ email: newUser.email });

        expect(user).not.toBeNull();

        done();
    });

    it('Should respond with 409 error when a user already exists', (done) => {
        request(app).post('/users').send(newUser).expect(409, done);
    });

    it('Should respond with 400 error when not all data are provided', (done) => {
        request(app).post('/users').send(newInclompleteUser).expect(400, done);
    });
});

describe('DELETE /users/:id', () => {
    afterAll(async () => {
        await User.deleteMany({});
    });

    it('Should return 400 if no id is provided', (done) => {
        request(app).delete('/users/null').expect(400, done);
    });

    it('Should return 400 if id is invalid', (done) => {
        request(app).delete('/users/123123').expect(400, done);
    });

    it('Should return 404 if no user with such id is found', (done) => {
        request(app)
            .delete('/users/5f1930bec422bf5e4d93e573')
            .expect(404, done);
    });

    it('Should delete user', async (done) => {
        const user = new User({ email: newUser.email });
        await user.setPassword(newUser.password);
        const { _id: id } = await user.save();

        await request(app).delete(`/users/${id}`).expect(200);

        const savedUser = await User.findById(id);

        expect(savedUser).toBeNull();

        done();
    });
});

// describe('POST /users/login', () => {
//     beforeAll(async () => {
//         const { email, password } = newUser;
//         const user = new User({ email });

//         await user.setPassword(password);
//         await user.save();
//     });
//     afterAll(async () => {
//         await User.deleteMany({});
//     });

//     it('Should return 400 if no email is provided', (done) => {
//         request(app)
//             .post('/users/login')
//             .send({ password: newUser.password })
//             .expect(400, done);
//     });

//     it('Should return 400 if no password is provided', (done) => {
//         request(app)
//             .post('/users/login')
//             .send({ email: newUser.email })
//             .expect(400, done);
//     });

//     it('Should return 404 if no email or password are provided', (done) => {
//         request(app).post('/users/login').expect(400, done);
//     });
// });

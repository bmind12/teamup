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

describe('POST /users', () => {
    afterAll(async () => {
        await User.deleteMany({});
    });

    it('Should register user', async (done) => {
        await request(app).post('/users').send(newUser).expect(201);

        const user = await User.findOne({ email: newUser.email });

        expect(user).toMatchObject(newUser);

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

    it('Should return 400 if no user with such id is found', (done) => {
        request(app)
            .delete('/users/5f1930bec422bf5e4d93e573')
            .expect(400, done);
    });

    it('Should delete user', async (done) => {
        const { _id: id } = await User.create(newUser);

        await request(app).delete(`/users/${id}`).expect(200);

        const user = await User.findById(id);

        expect(user).toBeNull();

        done();
    });
});

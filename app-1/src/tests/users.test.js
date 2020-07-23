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

describe('/users', () => {
    beforeAll(async () => {
        await User.deleteMany();
    });

    afterAll(async () => {
        await User.deleteMany({});
        connection.close();
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

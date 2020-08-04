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

    it('Should register a user', async (done) => {
        const response = await request(app)
            .post('/users')
            .send(newUser)
            .expect(201);
        const {
            user: { email },
            salt,
            passwordHash
        } = response.body;

        expect(email).toBe(newUser.email);
        expect(salt).toBeUndefined();
        expect(passwordHash).toBeUndefined();
        expect(response.headers['set-cookie'][0]).not.toBeUndefined();

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

describe('DELETE /users/me', () => {
    afterAll(async () => {
        await User.deleteMany({});
    });

    it('Should delete user', async (done) => {
        const response = await request(app).post('/users').send(newUser);

        await request(app)
            .delete(`/users/me`)
            .set('Cookie', response.headers['set-cookie'][0])
            .expect(200);

        const deletedUser = await User.findById(response.body.user._id);

        expect(deletedUser).toBeNull();

        done();
    });

    it('Should return 401 if there is no cookie', (done) => {
        request(app).delete('/users/me').expect(401, done);
    });

    it('Should return 401 if a cookie is invalid', (done) => {
        request(app)
            .delete('/users/me')
            .set('Cookie', ['wrong=cookie'])
            .expect(401, done);
    });
});

describe('POST /users/login', () => {
    beforeAll(async () => {
        const { email, password } = newUser;

        await User.createUser(email, password);
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    it('Should return 400 if no email is provided', (done) => {
        request(app)
            .post('/users/login')
            .send({ password: newUser.password })
            .expect(400, done);
    });

    it('Should return 400 if no password is provided', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: newUser.email })
            .expect(400, done);
    });

    it('Should return 401 if no user with such email', (done) => {
        request(app)
            .post('/users/login')
            .send(Object.assign({}, newUser, { email: 'wrong@email.com' }))
            .expect(401, done);
    });

    it('Should return 401 if wrong password', (done) => {
        request(app)
            .post('/users/login')
            .send(Object.assign({}, newUser, { password: 'wrong-password' }))
            .expect(401, done);
    });

    it('Should return a user and 200 if correct credentials', async (done) => {
        const response = await request(app)
            .post('/users/login')
            .send(newUser)
            .expect(200);

        const {
            user: { email }
        } = response.body;

        expect(email).toBe(newUser.email);
        expect(response.headers['set-cookie'][0]).not.toBeUndefined();

        done();
    });
});

describe('POST /users/logout', () => {
    let cookie;

    beforeAll(async () => {
        const response = await request(app).post('/users').send(newUser);
        cookie = response.headers['set-cookie'][0];
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    it('Should return 401 if not authenticated', (done) => {
        request(app).post('/users/logout').expect(401, done);
    });

    it('Should remove session', async (done) => {
        const response = await request(app)
            .post('/users/logout')
            .set('Cookie', cookie)
            .expect(200);

        expect(response.body.user).not.toBeUndefined();
        expect(response.headers['set-cookie']).toBeUndefined();

        await request(app)
            .post('/users/logout')
            .set('Cookie', cookie)
            .expect(401);

        done();
    });
});

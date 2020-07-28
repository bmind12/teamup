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
            token,
            salt,
            passwordHash
        } = response.body;

        expect(email).toBe(newUser.email);
        expect(salt).toBeUndefined();
        expect(passwordHash).toBeUndefined();
        expect(token).not.toBeUndefined();

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
        const user = new User({ email: newUser.email });
        await user.setPassword(newUser.password);
        const { _id: id } = await user.save();
        const token = await user.generateAuthToken();

        await request(app)
            .delete(`/users/me`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const savedUser = await User.findById(id);

        expect(savedUser).toBeNull();

        done();
    });

    it('Should return 401 if there is no token', (done) => {
        request(app).delete('/users/me').expect(401, done);
    });

    it('Should return 401 if a token is invalid', (done) => {
        request(app)
            .delete('/users/me')
            .set('Authorization', 'Bearer invalid')
            .expect(401, done);
    });

    it('Should return 401 if no user with such id is found', (done) => {
        request(app).delete('/users/me').expect(401, done);
    });
});

describe('POST /users/login', () => {
    beforeAll(async () => {
        const { email, password } = newUser;
        const user = new User({ email });

        await user.setPassword(password);
        await user.save();
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

    it('Should return 404 if no user with such email', (done) => {
        request(app)
            .post('/users/login')
            .send(Object.assign({}, newUser, { email: 'wrong@email.com' }))
            .expect(404, done);
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
            user: { email },
            token
        } = response.body;

        expect(email).toBe(newUser.email);
        expect(token).not.toBeUndefined();
        done();
    });
});

describe('POST /users/logoutAll', () => {
    afterAll(async () => {
        await User.deleteMany({});
    });

    it('Should return 401 if not authenticated', (done) => {
        request(app).post('/users/logoutAll').expect(401, done);
    });

    it('Should remove all tokens', async (done) => {
        const { email, password } = newUser;
        const user = new User({ email });

        await user.setPassword(password);
        token = await user.generateAuthToken();
        await user.save();

        const response = await request(app)
            .post('/users/logoutAll')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body.user).not.toBeUndefined();
        expect(response.body.token).toBeUndefined();

        const updatedUser = await User.findById(response.body.user._id);

        expect(updatedUser.tokens.length).toBe(0);

        done();
    });
});

describe('POST /users/logout', () => {
    afterAll(async () => {
        await User.deleteMany({});
    });

    it('Should return 401 if not authenticated', (done) => {
        request(app).post('/users/logout').expect(401, done);
    });

    it('Should remove all tokens', async (done) => {
        const { email, password } = newUser;
        const user = new User({ email });

        await user.setPassword(password);
        token = await user.generateAuthToken(100);
        await user.generateAuthToken(200);
        await user.generateAuthToken(300);
        await user.save();

        const response = await request(app)
            .post('/users/logout')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body.user).not.toBeUndefined();
        expect(response.body.token).toBeUndefined();

        const updatedUser = await User.findById(response.body.user._id);

        expect(
            updatedUser.tokens.find((userToken) => userToken.token === token)
        ).toBeUndefined();
        expect(updatedUser.tokens.length).toBe(2);

        done();
    });
});

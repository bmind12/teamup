const request = require('supertest');
const app = require('../app');

describe('Validating /users route', () => {
    it('Should register user', async () => {
        const userData = { hello: 'world' };

        const response = await request(app)
            .post('/users')
            .send(userData)
            .expect(200);

        expect(response.body).toMatchObject(userData);
    });
});

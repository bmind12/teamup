import { user1, user2 } from '../../../fixtures/users';

describe('Login', () => {
    before(() => {
        cy.task('clean:users');
        cy.task('seed:user', user1);
    });

    it('Should return 400 if no email is provided', () => {
        cy.request({
            url: '/auth/login',
            method: 'POST',
            body: { password: user1.password },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
        });
    });

    it('Should return 400 if no password is provided', () => {
        cy.request({
            url: '/auth/login',
            method: 'POST',
            body: { email: user1.email },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
        });
    });

    it('Should return 401 if no user with such email', () => {
        cy.request({
            url: '/auth/login',
            method: 'POST',
            body: user2,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
        });
    });

    it('Should return 401 if wrong password', () => {
        cy.request({
            url: '/auth/login',
            method: 'POST',
            body: { email: user1.email, password: user2.password },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
        });
    });

    it('Should return a user and 200 if correct credentials', () => {
        cy.request({
            url: '/auth/login',
            method: 'POST',
            body: user1
        }).then((response) => {
            const {
                user: { email }
            } = response.body;

            expect(response.status).to.equal(200);
            expect(email).to.equal(user1.email);
            cy.getCookies()
                .should('have.length', 1)
                .then((cookies) => {
                    expect(cookies[0]).to.have.property('name', 'connect.sid');
                });
        });
    });
});

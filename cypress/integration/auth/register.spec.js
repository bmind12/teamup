import { user1 } from '../../fixtures/users';

describe('Registration', () => {
    before(() => {
        cy.task('clean:users');
    });

    it('Should register a user', () => {
        cy.request({
            url: '/auth/register',
            method: 'POST',
            body: user1
        }).then((response) => {
            const {
                user: { email },
                salt,
                passwordHash
            } = response.body;

            expect(response.status).to.equal(201);
            expect(email).to.equal(user1.email);
            expect(salt).to.be.an('undefined');
            expect(passwordHash).to.be.an('undefined');
            cy.getCookies()
                .should('have.length', 1)
                .then((cookies) => {
                    expect(cookies[0]).to.have.property('name', 'connect.sid');
                });
        });
    });

    it('Should respond with 409 error when a user already exists', () => {
        cy.request({
            url: '/auth/register',
            method: 'POST',
            body: user1,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(409);
        });
    });

    it('Should respond with 400 error when not all data are provided', () => {
        cy.request({
            url: '/auth/register',
            method: 'POST',
            body: { email: user1.email },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
        });
    });
});

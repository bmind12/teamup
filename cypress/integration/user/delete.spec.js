import { user1 } from '../../fixtures/users';

describe('User deletion', () => {
    before(() => {
        cy.task('clean:users');
        cy.request({
            url: '/auth/register',
            method: 'POST',
            body: user1
        });
    });

    it('Should delete user', async () => {
        cy.request({
            url: '/users/me/delete',
            method: 'DELETE',
            body: user1
        }).then((response) => {
            expect(response.status).to.equal(200);
        });
    });

    it('Should return 401 when logging in if there is no user', () => {
        cy.request({
            url: '/auth/login',
            method: 'POST',
            body: user1,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
        });
    });

    it('Should return 401 if a cookie is invalid', () => {
        cy.request({
            url: '/auth/register',
            method: 'POST',
            body: user1
        });
        cy.setCookie('connect.sid', 'wrong');
        cy.request({
            url: '/users/me/delete',
            method: 'DELETE',
            body: user1,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
        });
    });
});

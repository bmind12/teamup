import { user1, user2, user3 } from '../../fixtures/users';

describe('User update', () => {
    before(() => {
        cy.task('clean:users');
        cy.request({
            url: '/auth/register',
            method: 'POST',
            body: user2
        });
        cy.request({
            url: '/auth/register',
            method: 'POST',
            body: user1
        });
    });

    it('should not update user email if it already exists', () => {
        cy.request({
            url: '/users/me/update',
            method: 'PATCH',
            body: { email: user2.email },
            failOnStatusCode: false
        }).then((response) => {
            console.log('### response', response);
            expect(response.status).to.equal(409);
        });
    });

    it('should update user', async () => {
        cy.request({
            url: '/users/me/update',
            method: 'PATCH',
            body: { email: user3.email }
        }).then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body.user.email).toBe(user3.email);
        });
    });

    it('should return 401 for without a cookie', () => {
        cy.clearCookies();
        cy.request({
            url: '/users/me/update',
            method: 'PATCH',
            body: user1,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
        });
    });
});

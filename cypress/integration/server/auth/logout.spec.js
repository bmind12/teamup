import { user1 } from '../../../fixtures/users';

describe('Logout', () => {
    before(() => {
        cy.task('clean:users');
        cy.request({
            url: '/auth/register',
            method: 'POST',
            body: user1
        });
    });

    it('Should remove session', () => {
        cy.request({
            url: '/auth/logout',
            method: 'POST'
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.user).not.to.be.an('undefined');
            expect(response.headers['set-cookie']).to.be.an('undefined');
        });
    });

    it('Should not log out if already logged out', () => {
        cy.request({
            url: '/auth/logout',
            method: 'POST',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
        });
    });
});

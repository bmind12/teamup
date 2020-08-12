describe('Logout', () => {
    before(() => {
        cy.task('clean:users');
        cy.buildUser().then((user) => {
            cy.request({
                url: '/auth/register',
                method: 'POST',
                body: user
            });
        });
    });

    after(() => {
        cy.task('clean:users');
    });

    it('should remove session', () => {
        cy.request({
            url: '/auth/logout',
            method: 'POST'
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.user).not.to.be.an('undefined');
            expect(response.headers['set-cookie']).to.be.an('undefined');
        });
    });

    it('should not log out if not logged in', () => {
        cy.request({
            url: '/auth/logout',
            method: 'POST',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
        });
    });
});

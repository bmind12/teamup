describe('Registration', () => {
    let sameUser;

    before(() => {
        cy.task('clean:users');
    });

    after(() => {
        cy.task('clean:users');
    });

    it('should register a user', () => {
        cy.buildUser().then((user) => {
            sameUser = user;

            cy.request({
                url: '/auth/register',
                method: 'POST',
                body: user
            }).then((response) => {
                const {
                    user: { email },
                    salt,
                    passwordHash
                } = response.body;

                expect(response.status).to.equal(201);
                expect(email).to.equal(user.email);
                expect(salt).to.be.an('undefined');
                expect(passwordHash).to.be.an('undefined');
                cy.getCookies()
                    .should('have.length', 1)
                    .then((cookies) => {
                        expect(cookies[0]).to.have.property(
                            'name',
                            'connect.sid'
                        );
                    });
            });
        });
    });

    it('should not register a user if email exists', () => {
        cy.buildUser({ email: sameUser.email }).then((user) => {
            cy.request({
                url: '/auth/register',
                method: 'POST',
                body: user,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(409);
            });
        });
    });

    it('should not register a user if something is missing', () => {
        cy.buildUser().then((user) => {
            cy.request({
                url: '/auth/register',
                method: 'POST',
                body: { email: user.email },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
            });
        });
    });
});

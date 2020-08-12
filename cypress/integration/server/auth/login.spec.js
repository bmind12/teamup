describe('Login', () => {
    let registeredUser;

    before(() => {
        cy.task('clean:users');
        cy.buildUser().then((user) => {
            registeredUser = user;

            cy.task('seed:user', user);
        });
    });

    after(() => {
        cy.task('clean:users');
    });

    it('should not log in without email', () => {
        cy.request({
            url: '/auth/login',
            method: 'POST',
            body: { password: registeredUser.password },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400);
        });
    });

    it('should not log in without password', () => {
        cy.buildUser().then((user) => {
            cy.request({
                url: '/auth/login',
                method: 'POST',
                body: { email: registeredUser.email },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(400);
            });
        });
    });

    it('should not log in if no user found', () => {
        cy.buildUser().then((newUser) => {
            cy.request({
                url: '/auth/login',
                method: 'POST',
                body: newUser,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(401);
            });
        });
    });

    it('should not login if wrong password', () => {
        cy.buildUser().then((newUser) => {
            cy.request({
                url: '/auth/login',
                method: 'POST',
                body: {
                    email: registeredUser.email,
                    password: newUser.password
                },
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.equal(401);
            });
        });
    });

    it('should log in', () => {
        cy.request({
            url: '/auth/login',
            method: 'POST',
            body: registeredUser
        }).then((response) => {
            const {
                user: { email }
            } = response.body;

            expect(response.status).to.equal(200);
            expect(email).to.equal(registeredUser.email);
            cy.getCookies()
                .should('have.length', 1)
                .then((cookies) => {
                    expect(cookies[0]).to.have.property('name', 'connect.sid');
                });
        });
    });
});

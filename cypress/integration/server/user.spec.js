describe('User deletion', () => {
    let registeredUser, validCookie;

    before(() => {
        cy.task('clean:users');
        cy.buildUser().then((user) => {
            cy.registerUser(user).then(() => {
                registeredUser = user;

                cy.getCookie('connect.sid').then((cookie) => {
                    validCookie = cookie.value;
                });
            });
        });
    });

    after(() => {
        cy.task('clean:users');
    });

    it('should not delete if cookie is invalid', () => {
        cy.setCookie('connect.sid', 'wrong');
        cy.request({
            url: '/users/me',
            method: 'DELETE',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
        });
    });

    it('should delete user', () => {
        cy.setCookie('connect.sid', validCookie);
        cy.request({
            url: '/users/me',
            method: 'DELETE'
        }).then((response) => {
            expect(response.status).to.equal(200);
        });
    });

    it('should not log in if no user', () => {
        cy.request({
            url: '/auth/login',
            method: 'POST',
            body: registeredUser,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
        });
    });
});

describe('User update', () => {
    let anotherUser, validCookie;

    before(() => {
        cy.task('clean:users');
        cy.buildUser().then((user) => {
            cy.registerUser(user).then(() => {
                anotherUser = user;
            });
        });
        cy.buildUser().then((user) => {
            cy.registerUser(user);

            cy.getCookie('connect.sid').then((cookie) => {
                validCookie = cookie.value;
            });
        });
    });

    after(() => {
        cy.task('clean:users');
    });

    it('should update user', () => {
        cy.buildUser().then((user) => {
            cy.request({
                url: '/users/me',
                method: 'PATCH',
                body: { email: user.email }
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.user.email).to.equal(user.email);
            });
        });
    });

    it('should not update email if such email already exists', () => {
        cy.setCookie('connect.sid', validCookie);
        cy.request({
            url: '/users/me',
            method: 'PATCH',
            body: { email: anotherUser.email },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(409);
        });
    });

    it('should not update user without a cookie', () => {
        cy.request({
            url: '/users/me',
            method: 'PATCH',
            body: anotherUser,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(401);
        });
    });
});

describe('Signin page', () => {
    before(() => {
        cy.task('clean:users');
    });

    it('logs in a user', () => {
        cy.buildUser().then((user) => {
            cy.task('seed:user', user);
            cy.visit('/login');
            cy.findByLabelText(/email/i).type(user.email, {
                force: true
            });
            cy.findByLabelText(/password/i).type(user.password, {
                force: true
            });
            cy.findByRole('button').click();
            cy.location('pathname').should('include', '/users/me');
        });
    });
});

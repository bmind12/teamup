describe('Signup page', () => {
    it('registers a user', () => {
        cy.visit('/register');
        cy.buildUser().then((user) => {
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

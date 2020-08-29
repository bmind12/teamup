describe('Signup page', () => {
    before(() => {
        cy.task('clean:users');
    });

    beforeEach(() => {
        cy.visit('/register');
    });

    it('registers a user', () => {
        cy.buildUser().then((user) => {
            cy.findByLabelText(/email/i).type(user.email);
            cy.findByLabelText(/password/i).type(user.password);
            cy.findByRole('button').click();
            cy.location('pathname').should('include', 'users');
        });
    });
});

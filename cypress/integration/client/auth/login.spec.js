describe('Signin page', () => {
    let registeredUser;

    before(() => {
        cy.task('clean:users');
        cy.buildUser().then((user) => {
            registeredUser = user;

            cy.task('seed:user', user);
        });
    });

    beforeEach(() => {
        cy.visit('/login');
    });

    it('registers a user', () => {
        cy.findByLabelText(/email/i).type(registeredUser.email);
        cy.findByLabelText(/password/i).type(registeredUser.password);
        cy.findByRole('button').click();
        cy.location('pathname').should('include', 'users');
    });
});

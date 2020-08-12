import { userBuilder } from './generate';

Cypress.Commands.add('buildUser', (overwrites) => {
    return userBuilder(overwrites);
});

Cypress.Commands.add('registerUser', (user) => {
    cy.request({
        url: '/auth/register',
        method: 'POST',
        body: user
    });
});

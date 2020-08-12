const { build, fake } = require('test-data-bot');

export const userBuilder = build('User').fields({
    email: fake((f) => f.internet.email()),
    password: fake((f) => f.internet.password())
});

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connection = require('./connection');

module.exports = (app) => {
    const sesssionOptions = {
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 1000 * 60 * 60 * 24 * 2, // 2 days
            secure: app.get('env') === 'production'
        },
        store: new MongoStore({
            mongooseConnection: connection,
            autoRemove: 'interval',
            autoRemoveInterval: 10
        })
    };

    return session(sesssionOptions);
};

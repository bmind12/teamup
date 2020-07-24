module.exports = {
    mongodb: {
        dbHost: 'localhost',
        dbName: process.env.NODE_ENV === 'test' ? 'node-test' : 'node-dev',
        debug: process.env.NODE_ENV === 'dev'
    }
};

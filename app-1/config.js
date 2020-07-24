module.exports = {
    mongodb: {
        dbHost: 'localhost',
        dbName: process.env.NODE_ENV === 'test' ? 'node-test' : 'node-dev',
        debug: process.env.NODE_ENV === 'dev'
    },
    crypto: {
        iterations: process.env.NODE_ENV === 'test' ? 1 : 12000,
        length: 128,
        digest: 'sha512'
    }
};

const mongoose = require('mongoose');
const config = require('../../config');

const url = `mongodb://${config.mongodb.dbHost}/${config.mongodb.dbName}`;
const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.set('debug', config.mongodb.debug);

module.exports = mongoose.createConnection(url, mongooseConfig);

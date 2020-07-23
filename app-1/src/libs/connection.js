const mongoose = require('mongoose');
const config = require('../../config.json');

mongoose.set('debug', process.env.NODE_ENV === 'dev');

const url = `mongodb://${config[process.env.NODE_ENV].dbHost}/${
    config[process.env.NODE_ENV].dbName
}`;
const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

module.exports = mongoose.createConnection(url, mongooseConfig);

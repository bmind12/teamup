const mongoose = require('mongoose');
const config = require('../../config.json');

mongoose.set('debug', process.env.NODE_ENV === 'test');

mongoose.connect(
    `mongodb://${config[process.env.NODE_ENV].dbHost}/${
        config[process.env.NODE_ENV].dbName
    }`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

module.exports = mongoose;

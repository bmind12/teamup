const mongoose = require('mongoose');

const url = `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_NAME}`;
const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.set('debug', process.env.MONGODB_DEBUG);

module.exports = mongoose.createConnection(url, mongooseConfig);

import mongoose from 'mongoose';

const url = `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_NAME}`;
const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.set('debug', process.env.MONGODB_DEBUG);

export default mongoose.createConnection(url, mongooseConfig);

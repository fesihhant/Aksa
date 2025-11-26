const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('In DB Config - IS_LOCAL:', process.env.IS_LOCAL);
        const url = process.env.IS_LOCAL === 'true' ? process.env.MONGODB_URI : process.env.MONGODB_URI_DEV;
        console.log('Connecting to MongoDB at:', url);
        const conn = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn}`);
        console.log(`MongoDB Connected: ${conn.connection}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);


    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        console.error('Error connecting to MongoDB:', error.message);

        process.exit(1);
    }
};

module.exports = connectDB;

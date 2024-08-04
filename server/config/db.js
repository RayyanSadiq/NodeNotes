const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async () => {
    console.log(process.env.MONGODB_URI);
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);

    }
}

module.exports = connectDB;
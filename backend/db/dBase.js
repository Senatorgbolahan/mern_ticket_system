const mongoose = require('mongoose')


const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongoose connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(`Mongoose connected: ${error.message}`.red.underline);
        process.exit(1)
    }
}

module.exports = connectDB;
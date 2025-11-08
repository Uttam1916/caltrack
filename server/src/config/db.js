const mongoose = require('mongoose');

async function connectDB() {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/calorietrack';
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB:', uri);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}

module.exports = connectDB;
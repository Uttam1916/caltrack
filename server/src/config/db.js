const mongoose = require('mongoose');

async function connectDB(){
        const uri = process.env.MONGO_URI
        if(!uri){
            throw new Error('mongo uri not set')
        }
        await mongoose.connect(uri)
        console.log('connected to database:', uri)
}

module.exports = connectDB()
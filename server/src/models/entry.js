const mongoose = require('mongoose')

//table equivalent in nosql databases
const FoodEntry = new mongoose.Schema({
    userId : {type: String , required : true},
    calories : {type: Number, required: true},
    protein : {type: Number, required: true},
    fat : {type: Number, required: true},
    carb : {type: Number, required: true},
    date: {type: Date, default: Date.now},
})


//this is what other modules/files get when the do the 'require
module.exports = mongoose.model('Entry', FoodEntry)
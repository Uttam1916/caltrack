const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        calories: { type: Number, required: true },
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fats: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        // optional user id for multi-user support
        userId: { type: String }
    },
    { timestamps: true }
);

// index for efficient queries by user and date
EntrySchema.index({ userId: 1, date: -1 });
module.exports = mongoose.model('Entry', EntrySchema);
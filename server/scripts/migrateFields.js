// Simple migration script to normalize existing entry documents to the current schema.
// Usage: from repo root: node server/scripts/migrateFields.js
require('dotenv').config();
const connectDB = require('../src/config/db');
const mongoose = require('mongoose');
const Entry = require('../src/models/entry');

async function run() {
  try {
    await connectDB();
    console.log('Connected, starting migration...');

    // Example migrations:
    // - rename 'carb' -> 'carbs'
    // - rename 'fat' -> 'fats'
    // - if 'name' missing, set to 'Unknown'

    const bulk = [];

    const cursor = Entry.collection.find({});
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      const update = {};
      if (doc.carb !== undefined && doc.carbs === undefined) {
        update.carbs = doc.carb;
        update.$unset = Object.assign(update.$unset || {}, { carb: '' });
      }
      if (doc.fat !== undefined && doc.fats === undefined) {
        update.fats = doc.fat;
        update.$unset = Object.assign(update.$unset || {}, { fat: '' });
      }
      if (doc.name === undefined && doc.foodName) {
        update.name = doc.foodName;
        update.$unset = Object.assign(update.$unset || {}, { foodName: '' });
      }
      if (doc.name === undefined && !doc.foodName) {
        update.name = 'Unknown';
      }

      if (Object.keys(update).length) {
        bulk.push({ updateOne: { filter: { _id: doc._id }, update: { $set: update, ...(update.$unset ? { $unset: update.$unset } : {}) } } });
      }
    }

    if (bulk.length) {
      console.log('Applying', bulk.length, 'updates...');
      const res = await Entry.collection.bulkWrite(bulk);
      console.log('Migration result:', res.result || res);
    } else {
      console.log('No documents to migrate');
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
}

run();

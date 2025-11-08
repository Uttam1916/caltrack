const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);

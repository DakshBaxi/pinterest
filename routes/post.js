const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
    image:{
    type: String,
  },
  imageText: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('Post', postSchema);



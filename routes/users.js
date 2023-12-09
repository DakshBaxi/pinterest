const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')
mongoose.connect("mongodb+srv://baxidaksh2004:12345678qwerty@cluster0.jrplcjp.mongodb.net/");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  dp: {
    type: String, // Assuming the profile picture is stored as a URL
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
});
userSchema.plugin(plm)

module.exports  = mongoose.model('User', userSchema);


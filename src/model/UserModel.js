const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model("User", userSchema)

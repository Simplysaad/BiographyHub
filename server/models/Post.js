//Post.js

const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    required: true,
    unique: true,
    type: String
    //,default: 'no title provided'
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: 'Saad Idris'
  },
  imageUrl: {
    type: String,
    default: 'no-image.jpg'
  },
  category: {
    type: String,
    default: 'General'
  },
  tags: [String],
  birthDate: Date,
  deathDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Post", postSchema)
  

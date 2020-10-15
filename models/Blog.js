const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema ({
  title: {
    type: String,
    required: true
  },
  publishDate: Date,
  author: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Realtor',
  }],
  img: String,
  topic: String,
  synopsis: String,
  blogPost: String,
}, {timestamps: true});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
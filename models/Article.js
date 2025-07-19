const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  body: String,
  section: {
    type: String,
    required: true,
    enum: [
      'trending',
      'articles',
      'latest',
      'second_section',
      'infinite_card',
      'vertical',
      'grid',
    ],
  },
  published: { type: Boolean, default: false },
  imageUrl: String,
  cloudinaryId: String,
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', articleSchema);

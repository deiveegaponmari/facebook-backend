const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: false
  },
  videoUrl: {
    type: String,
    required: false
  },
}, { timestamps: true });

// Custom validation: At least one field should be present
postSchema.pre('validate', function (next) {
  if (!this.imageUrl && !this.videoUrl) {
    next(new Error('Either imageUrl or videoUrl is required.'));
  } else {
    next();
  }
});
const PostModel = mongoose.model('post', postSchema);
module.exports = PostModel;

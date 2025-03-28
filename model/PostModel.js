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
  likes:{
    type:Number
  }
}, { timestamps: true });

// Custom validation: At least one field should be present
postSchema.pre('validate', function (next) {
  if (!this.imageUrl && !this.videoUrl) {
    next(new Error('Either imageUrl or videoUrl is required.'));
  } else {
    next();
  }
});
const PostModel = mongoose.model('Post', postSchema);
module.exports = PostModel;

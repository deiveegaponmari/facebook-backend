const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  imageUrl: { type: String, required: false },
  videoUrl: { type: String, required: false }
}, { timestamps: true });

// Custom validation: At least one field should be present
mediaSchema.pre('validate', function (next) {
  if (!this.imageUrl && !this.videoUrl) {
    next(new Error('Either imageUrl or videoUrl is required.'));
  } else {
    next();
  }
});
module.exports = mongoose.model('Media', mediaSchema);

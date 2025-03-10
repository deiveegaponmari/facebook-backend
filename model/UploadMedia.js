const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  imageUrl: { type: String },
  videoUrl: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24 hours
}, { timestamps: true });

// Custom validation: Ensure at least one media field exists
mediaSchema.path('imageUrl').validate(function (value) {
  return this.imageUrl || this.videoUrl; // At least one must exist
}, 'Either imageUrl or videoUrl is required.');

const mediaModel = mongoose.model('Media', mediaSchema);
module.exports = mediaModel;

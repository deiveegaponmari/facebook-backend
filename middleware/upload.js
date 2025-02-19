const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'statuses', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'mp4', 'mov', 'avi'],
    resource_type: 'auto', // Supports images & videos
  },
});

const upload = multer({ storage });

module.exports = upload;

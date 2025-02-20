const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Load environment variables
const path = require('path');
const fs = require('fs');
const media=require("../model/UploadMedia");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// Define the image path (relative to project folder)
const imagePath = path.join(__dirname, '../images/1.jpg');
const videoPath = path.join(__dirname, "../images/video1.mp4")

// Check if files exist
if (!fs.existsSync(imagePath)) {
  console.error("Error: Image file not found at", imagePath);
  process.exit(1);
}

if (!fs.existsSync(videoPath)) {
  console.error("Error: Video file not found at", videoPath);
  process.exit(1);
}
/* const url=cloudinary.url("3_geguhm")
console.log(url) */

(async function () {
  try {
    const resultimg = await cloudinary.uploader.upload(imagePath)
    console.log(resultimg.secure_url)
    const resultvideo = await cloudinary.uploader.upload(videoPath, {
      resource_type: "video"
    })
    console.log(resultvideo.secure_url)
    //save to mongodb
    const newMedia=new media({     
      imageUrl:resultimg.secure_url,
      videoUrl:resultvideo.secure_url
    })
    await newMedia.save();
    console.log("upload image/video save to mongodb successfully")
  } catch (error) {
    console.log(error)
  }

})();
module.exports = cloudinary;

module.exports=cloudinary;
const MediaRouter = require("express").Router();
const mediaModel = require("../model/UploadMedia");
const cloudinary = require("cloudinary").v2;
const multer = require('multer')
const path = require("path");

//multer configure 

// Ensure files are stored with original names

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

require("dotenv").config();
// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

MediaRouter.post("/createmedia", upload.single("file"), async (req, res) => {
  console.log("Received file:", req.file); // Debugging
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
 // console.log(req.file)
  const filepath = req.file.path;
  console.log(filepath);
  try {
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ error: "Upload to Cloudinary failed" });
        }
        console.log("Cloudinary Upload Success:", result);
        res.json({ message: "File uploaded successfully", url: result.secure_url });
      }
    ).end(req.file.buffer); // ✅ Upload file directly from memory
  } catch (error) {
    console.error("File not uploaded:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});
 /*  try {
    const result = await cloudinary.uploader.upload(filepath);
    console.log(result)
  } catch (error) {
    console.log("file not upload")
  }
}) */

// Fetch Media from MongoDB
MediaRouter.get("/getfile", async (req, res) => {
  try {
    const media = await mediaModel.find();
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: "Error fetching media" });
  }
});

module.exports = MediaRouter;

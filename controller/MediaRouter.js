const MediaRouter = require("express").Router();
const mediaModel = require("../model/UploadMedia"); // MongoDB Model
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config();

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// **Upload Media to Cloudinary & Store in MongoDB**
MediaRouter.post("/createmedia", upload.single("file"), async (req, res) => {
  console.info("Incoming file upload request");

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Upload file to Cloudinary
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ error: "Upload to Cloudinary failed" });
        }

        // Determine if file is image or video
        const isImage = result.resource_type === "image";

        // Save to MongoDB with `createdAt`
        const newMedia = new mediaModel({
          imageUrl: isImage ? result.secure_url : null,
          videoUrl: !isImage ? result.secure_url : null,
          createdAt: new Date() // ✅ Ensure createdAt is saved
        });

        await newMedia.save();

        res.json({ message: "File uploaded successfully", url: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (error) {
    console.error("File upload failed:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

// **Fetch Media from MongoDB**
MediaRouter.get("/getfile", async (req, res) => {
  try {
    const mediaFiles = await mediaModel.find({}, "imageUrl videoUrl createdAt"); // ✅ Fetch createdAt

    // Transform data to match frontend expectations
    const formattedData = mediaFiles.map((file) => ({
      imageUrl: file.imageUrl,
      videoUrl: file.videoUrl,
      createdAt: file.createdAt // ✅ Send createdAt for filtering
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ message: "Error fetching media" });
  }
});

module.exports = MediaRouter;

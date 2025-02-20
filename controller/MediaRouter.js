const MediaRouter=require("express").Router();
const Media=require("../model/UploadMedia")
const multer = require("multer");
const path = require("path");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: "uploads/", // Folder to store uploaded files
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

//post media from client
MediaRouter.post("/createmedia", upload.single("media"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const newMedia = new Media({
      imageUrl: `/uploads/${req.file.filename}`, // Store file path in MongoDB
    });

    const savedMedia = await newMedia.save();

    console.log("File received:", req.file);

    res.json({
      message: "File uploaded successfully",
      fileUrl: savedMedia.imageUrl, // Return stored file URL
    });
  } catch (error) {
    console.error("Error saving to MongoDB:", error);
    res.status(500).json({ error: "Error saving file to database" });
  }
});
// Get All Media
MediaRouter.get('/media', async (req, res) => {
    try {
      const media = await Media.find();
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching media' });
    }
  });
module.exports={
    MediaRouter
}
module.exports = MediaRouter;

const PostRouter = require("express").Router();
const PostModel = require("../model/PostModel"); // MongoDB Model
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
PostRouter.post("/createpost", upload.single("file"), async (req, res) => {
  // print('image upload api incoimng with req :- '+req);
  console.info("image upload api incoimng with req :-", req);
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

        // Save to MongoDB
        const newMedia = new PostModel({
          imageUrl: isImage ? result.secure_url : null,
          videoUrl: !isImage ? result.secure_url : null,
        });

        await newMedia.save();

        res.json({ message: "File uploaded successfully", url: result.secure_url });
      }
    ).end(req.file.buffer); // ✅ Upload directly from memory
  } catch (error) {
    console.error("File not uploaded:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});
// **Fetch Media from MongoDB**
PostRouter.get("/getpost", async (req, res) => {
  try {
    const postFiles = await PostModel.find(); // Fetch from DB

    // Transform data to match frontend expectations
    const formattedData = postFiles.map((file) => ({
      media: file.imageUrl || file.videoUrl, // Use imageUrl or videoUrl
      type: file.imageUrl ? "image" : "video", // Determine type
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ message: "Error fetching media" });
  }
});

PostRouter.get("/share/:postId", async (req, res) => {
  const { postId } = req.params;
  
  try {
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const shareUrl =`${process.env.FRONTEND_URL}/post/${postId}`;
    res.json({ shareUrl });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = PostRouter;

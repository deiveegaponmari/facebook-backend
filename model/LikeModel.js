const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
   userId: {
      type: String, 
      required: true
    },
    postId: {
      type: String, 
      required: true
    },
    count: {
      type: Number,
    }
  },
  { timestamps: true } 
);

const LikeModel= mongoose.model("Like", LikeSchema);
module.exports = LikeModel;

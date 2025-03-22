const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
   userId: {
      type: String, 
      required: true
    },
    postId: {
      type: String, 
      required: true
    },
    comment: {
      type: String,
    },
    username:{
      type:String
    }
  },
  { timestamps: true } 
);

const CommentModel= mongoose.model("Comment", CommentSchema);
module.exports = CommentModel;

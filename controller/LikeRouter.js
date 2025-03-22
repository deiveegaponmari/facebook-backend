const LikeRouter = require("express").Router();
const LikeModel=require("../model/LikeModel")

LikeRouter.post("/:userId/:postId", async (req, res) => {
    const userId = req.params.userId;
    const postId=req.params.postId;

    console.log("userid---------",userId);
    console.log("postid------------",postId)
    
    try{
        const like=await LikeModel({userId:userId,postId:postId});
        const result=await like.save();
        if (result && result._id) {
            return res.status(201).json({
                message: "Like counted successfully",
                data: result,
                success: "true"
            })
        } else {
            return res.status(500).json({
                message: "Internal server error",
                success: "false"
            })
        }
    /* try {
      const post = await LikeModel.findByIdAndUpdate(
        postId,
        { $inc: { likes: 1 } },
        { new: true } 
      );
  
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      res.status(200).json({ message: "Post liked", likes: post.likes }); */
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
module.exports=LikeRouter;
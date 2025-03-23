const LikeRouter = require("express").Router();
const LikeModel=require("../model/LikeModel")

LikeRouter.post("/:userId/:postId", async (req, res) => {
    const userId = req.params.userId;
    const postId=req.params.postId;

    console.log("userid---------",userId);
    console.log("postid------------",postId)

    try {
      // Check if the user already liked the post
      const existingLike = await LikeModel.findOne({ userId, postId });
      console.log("existinglike-------",existingLike)
      if (existingLike) {
          // Unlike (remove the like)
          await LikeModel.deleteOne({ _id: existingLike._id });
          // update count +1 {existingLike.count: existingLike.count+1}
          // existingLike.count += 1;
          // await existingLike.save();
          return res.status(200).json({
              message: "Like removed",
              success: true,
              liked: true 
              // count:existingLike.count
          });
      } else {
          // Like (add new like)
          const newLike = new LikeModel({ userId, postId });
          // const newLike = new LikeModel({ userId, postId ,count:1});
          await newLike.save();

          return res.status(201).json({
              message: "Like added successfully",
              success: true,
              liked: true, // Indicate the post is now liked
              count:1
          });
      }
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
  
  

   /*  try{
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
    
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    } */
});

LikeRouter.get("/getcount/:postId", async (req, res) => {
    const { postId } = req.params;

    try {
      console.log("------------------------postId------",postId)
        const likeData = await LikeModel.find({ postId });
        console.log("likedata------",likeData)
        if (!likeData) {
            return res.status(200).json({ message: "No likes found", count: 0 });
        }
        /* const countData=likeData.isSelected("count")
        console.log("countdata----",countData) */
        console.log("countdata----", likeData);
        res.status(200).json({ countList: likeData });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
module.exports=LikeRouter;
const CommentRouter = require("express").Router();
const CommentModel = require("../model/CommentModel")
const PostModel=require("../model/PostModel");

CommentRouter.post("/:userId/:postId", async (req, res) => {
    const { userId, postId } = req.params;
    const { text } = req.body;
    console.log("userid------", userId);
    console.log("postid-----", postId)
    console.log("text-------", text)
    try {
       /*  const post = await CommentModel.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" }); */
        // ✅ Check if the post exists
        const postExists = await PostModel.exists({ _id: postId });
        if (!postExists) return res.status(404).json({ message: "Post not found" });

        const newComment = new CommentModel({ userId, postId, text })
        //post.comments.push(newComment);
        await newComment.save();
        // Emit socket event for real-time comment update
        io.emit("new_comment", { postId, comment: newComment });

        res.status(201).json({
            success: true,
            comment: { userId, postId, text }
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment" });
    }
});

// 📝 Get Comments by Post ID
CommentRouter.get("/:postId", async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await CommentModel.find({ postId }).populate("userId", "username avatar");
        res.status(200).json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});

module.exports = CommentRouter;
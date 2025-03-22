const CommentRouter = require("express").Router();
const CommentModel = require("../model/CommentModel")

CommentRouter.post("/:userId/:postId", async (req, res) => {
    const { userId, postId } = req.params;
    const { text } = req.body;

    try {
        const post = await CommentModel.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = { userId: userId, postId: postId, message: text, createdAt: new Date() };
        //post.comments.push(newComment);
        const result = await newComment.save();
        // Emit socket event for real-time comment update
        io.emit("new_comment", { postId, comment: newComment });
        if (result && result._id) {
            return res.status(201).json({
                message: "comment added successfully",
                data: result,
                success: "true"
            })
            /* // Emit socket event for real-time comment update
            io.emit("new_comment", { postId, comment: result }); */
        } else {
            return res.status(500).json({
                message: "Internal server error",
                success: "false"
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Error adding comment" });
    }
});

module.exports = CommentRouter;
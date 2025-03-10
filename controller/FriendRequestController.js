const FriendRequestController = require("express").Router();
const FriendRequestModel = require("../model/FriendRequestModel")

/* FriendRequestController.post("/:senderId/:receiverId", async (req, res) => {
    try {
        const senderId = req.params.senderId;
        const receiverId = req.params.receiverId;
        console.log("sender id", senderId);
        console.log | ("receiver id", receiverId)

        // Check if a request already exists
        const existingRequest = await FriendRequestModel.findOne({ senderId, receiverId });
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already sent." });
        }

        // Create a new friend request
        const newRequest = await FriendRequestModel.create({ senderId, receiverId, status: "pending" });

        res.status(201).json(newRequest);
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ message: "Server error" });
    }
}); */

FriendRequestController.post("/confirm/:senderId/:receiverId", async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        // Find the friend request and update its status
        const updatedRequest = await FriendRequestModel.findOneAndUpdate(
            { senderId, receiverId, status: "pending" }, // Find the request
            { status: "accepted" }, // Update status to accepted
            { new: true } // Return the updated document
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        res.json(updatedRequest);
    } catch (error) {
        console.error("Error confirming friend request:", error);
        res.status(500).json({ message: "Server error" });
    }
});

FriendRequestController.get("/accepted/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all friend requests where the user is either sender or receiver and the status is accepted
        const acceptedFriends = await FriendRequestModel.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
            status: "accepted"
        })
        .populate("senderId", "username avatar") // Populate sender details
        .populate("receiverId", "username avatar"); // Populate receiver details

        res.json(acceptedFriends);
    } catch (error) {
        console.error("Error fetching accepted friends:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = FriendRequestController;
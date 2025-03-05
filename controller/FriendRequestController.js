const FriendRequestController=require("express").Router();
const FriendRequestModel =require("../model/FriendRequestModel")

const sendFriendRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

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
};
module.exports=FriendRequestController;
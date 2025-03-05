const mongoose = require("mongoose");

// Define the schema
const FriendRequestSchema = new mongoose.Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" }
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

// Create the model
const FriendRequestModel = mongoose.model("FriendRequest", FriendRequestSchema);

module.exports = FriendRequestModel;

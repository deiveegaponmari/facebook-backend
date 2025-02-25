const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("./dbconfig");
require("dotenv").config();
const cors = require("cors");

const UserRouter = require("./controller/UserController");
const MediaRouter = require("./controller/MediaRouter");
const PostRouter = require("./controller/PostRouter");
const Message = require("./model/MessageModel");

const web_server = express();
web_server.use(express.json());
web_server.use(cors());
web_server.use(express.urlencoded({ extended: true }));

const server = http.createServer(web_server);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = new Map();

// Listen for client connections
io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Store user connection
  socket.on("register", (userId) => {
    users.set(userId, socket.id);
    console.log(`User registered: ${userId} -> ${socket.id}`);
  });

  // Retrieve previous messages from MongoDB
  socket.on("load_messages", async ({ senderId, recipientId }) => {
    try {
      const messages = await Message.find({
        $or: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      }).sort({ createdAt: 1 });

      socket.emit("previous_messages", messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  // Send message event
  socket.on("send_message", async ({ senderId, recipientId, text }) => {
    console.log(`Message from ${senderId} to ${recipientId}: ${text}`);

    try {
      const newMessage = new Message({ senderId, recipientId, text });
      await newMessage.save();

      const recipientSocketId = users.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receive_message", newMessage);
        io.to(recipientSocketId).emit("new_message_notification", {
          senderId,
          message: "You have a new message!",
        });
      }

      socket.emit("message_sent", { success: true });
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("message_sent", { success: false, error: "Message failed to send" });
    }
  });
  // Handle Like Event
  socket.on("like_post", ({ postId, username }) => {
    console.log(`Post ${postId} liked by ${username}`);
    io.emit("notification", { message: `${username} liked your post!` }); // Broadcast notification
  });
  //Handle comment Event
  socket.on("comment_post", ({ postId, username }) => {
    console.log(`Post ${postId}  comment by ${username}`);
    io.emit("notification", { message: `${username} comment your post!` }); // Broadcast notification
  });

  //handle friend Request event

  socket.on("friend_request", ({ senderId, recipientId, action }) => {
    console.log(`${senderId} sent a friend request to ${recipientId} - ${action}`);

    const recipientSocketId = users.get(recipientId);
    if (recipientSocketId) {
        io.to(recipientSocketId).emit("notification", {
            message: `${senderId} Friend Request ${action}ed!`
        });
    }
});

  /* socket.on("notification", ({ action, username }) => {
    console.log(`Post ${action} friendRequest by ${action}`);
    io.emit("notification", { message: ` ${username} Friend Request ${action}ed  !` }); // Broadcast notification
  }) */

  // Handle user disconnect
  socket.on("disconnect", () => {
    for (let [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Routers
web_server.use("/user", UserRouter);
web_server.use("/media", MediaRouter);
web_server.use("/post", PostRouter);

server.listen(process.env.HOST_PORT, process.env.HOST_NAME, () => {
  console.log("Server started successfully");
  console.log(`http://${process.env.HOST_NAME}:${process.env.HOST_PORT}/`);
});

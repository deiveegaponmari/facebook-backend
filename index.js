const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("./dbconfig");
require("dotenv").config();
const cors = require("cors");

const UserRouter = require("./controller/UserController");
const MediaRouter = require("./controller/MediaRouter");
const PostRouter = require("./controller/PostRouter");
const NewsfeedRouter=require("./controller/NewsfeedRouter")
const FriendListRouter=require("./controller/FriendListRouter")
const Message = require("./model/MessageModel");
const sendFriendRequest=require("./middleware/sendFriendRequest")
const FriendRequestController=require("./controller/FriendRequestController")
const FriendRequestModel=require("./model/FriendRequestModel")


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
 
//store active users
const onlineUsers = new Map();

// Listen for client connections
io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Store user connection
  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User registered: ${userId} -> ${socket.id}`);
    console.log("Current users map:", onlineUsers)
  });

   // Handle Friend Request
   socket.on("sendFriendRequest", async ({ senderId, receiverId }) => {
    console.log(senderId,receiverId)
    try {
        // Store in database
       const newFriendReq= new FriendRequestModel({ senderId, receiverId, status: "pending" });
       await newFriendReq.save();

        // Notify the recipient if they're online
        const receiverSocketId = onlineUsers.get(receiverId);
        console.log(receiverSocketId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("receiveFriendRequest", { senderId, receiverId });
        }
    } catch (error) {
        console.error("Error sending friend request:", error);
    }
});

// Handle Friend Request Cancellation
socket.on("cancelFriendRequest", async ({ senderId, receiverId }) => {
    try {
        await FriendRequestModel.deleteOne({ senderId, receiverId });

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("friendRequestCanceled", { senderId, receiverId });
        }
    } catch (error) {
        console.error("Error canceling friend request:", error);
    }
});
//friendrequest notification
/* socket.on("notification", ({ receiverId, message }) => {
  const receiverSocketId = onlineUsers.get(receiverId);
  if (receiverSocketId) {
      io.to(receiverSocketId).emit("notification", { message });
  }
});

 */
socket.on("notification", ({ receiverId, message }) => {
  console.log(`Notification event received for user ${receiverId} with message: ${message}`);

  const receiverSocketId = onlineUsers.get(receiverId);
  console.log(`Found socket ID for receiver: ${receiverSocketId}`);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("notification", { message,receiverId });
    console.log(` Notification sent to user ${receiverId} at socket ${receiverSocketId}`);
  } else {
    console.log(`User ${receiverId} is not online. Notification not sent.`);
  }
});

 
// Send message event (listen the messages from client or user)
socket.on("send_message", async ({ senderId, recipientId, text }) => {
  console.log("📨 Received send_message event:", { senderId, recipientId, text });
  //console.log(`Message from ${senderId} to ${recipientId}: ${text}`);

  if (!senderId || !recipientId || !text) {
    console.error("Error: Missing senderId, recipientId, or text");
    return;
  }
  try {
    const newMessage = new Message({ senderId, recipientId, text });
    console.log("📝 Message Before Saving:", newMessage);
    await newMessage.save();
    console.log("✅ Message Saved to MongoDB:", newMessage);

    const recipientSocketId = onlineUsers.get(recipientId);
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

  
  // Handle Like Event
/*   socket.on("like_post", ({ postId, username }) => {
    console.log(`Post ${postId} liked by ${username}`);
    io.emit("notification", { message: `${username} liked your post!` }); // Broadcast notification
  }); */
  //Handle comment Event
 /*  socket.on("comment_post", ({ postId, username }) => {
    console.log(`Post ${postId}  comment by ${username}`);
    io.emit("notification", { message: `${username} comment your post!` }); // Broadcast notification
  }); */

  //handle friend Request event

/*   socket.on("friend_request", ({ senderId, recipientId, action }) => {
    console.log(`${senderId} sent a friend request to ${recipientId} - ${action}`);

    const recipientSocketId = users.get(recipientId);
    if (recipientSocketId) {
        io.to(recipientSocketId).emit("notification", {
            message: `${senderId} Friend Request ${action}ed!`
        });
    }
}); */

  /* socket.on("notification", ({ action, username }) => {
    console.log(`Post ${action} friendRequest by ${action}`);
    io.emit("notification", { message: ` ${username} Friend Request ${action}ed  !` }); // Broadcast notification
  }) */

  // Handle user disconnect
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
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
web_server.use("/newsfeed",NewsfeedRouter)
web_server.use("/friendlist",FriendListRouter)
web_server.use("/friendrequest",FriendRequestController)

server.listen(process.env.HOST_PORT, process.env.HOST_NAME, () => {
  console.log("Server started successfully");
  console.log(`http://${process.env.HOST_NAME}:${process.env.HOST_PORT}/`);
});

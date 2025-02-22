//import express server
const express = require('express');
//http server creation
const http = require('http');
const { Server } = require('socket.io');
//import mongodb connection
require("./dbconfig")
require('dotenv').config()
var cors = require("cors");

const UserRouter = require("./controller/UserController")
const MediaRouter = require("./controller/MediaRouter")
const PostRouter = require("./controller/PostRouter")
//import message modal
const Message = require("./model/MessageModel");
//import cloudinary
//const cloudinary=require("./config/cloudinary")
const web_server = express();
//body-parser
web_server.use(express.json())
web_server.use(cors())
web_server.use(express.urlencoded({ extended: true })); // Parse URL-encoded data


// Serve static files (for uploaded media)
//web_server.use("/uploads", express.static("uploads"));
//enable http server
const server = http.createServer(web_server);

const io = new Server(server, {
    cors: {
        origin: "*", // Adjust to match frontend URL
        methods: ["GET", "POST"]
    }
});
// Listen for client connections
io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send previous messages from MongoDB when a new user connects
    try {
        const messages = await Message.find().sort({ timestamp: 1 }); // Fetch in order
        socket.emit("previous_messages", messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
    }

    // Listen for new messages
    socket.on("send_message", async (data) => {
        console.log("Message received:", data);

        // Save message to MongoDB
        try {
            const newMessage = new Message({ text: data });
            await newMessage.save();
            io.emit("receive_message", newMessage); // Broadcast message
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });
    // Handle Like Event
    socket.on("like_post", ({ postId, username }) => {
        console.log(`Post ${postId} liked by ${username}`);
        io.emit("notification", { message: `${username} liked your post!` }); // Broadcast notification
    });
    // Handle disconnect
  /*   socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    }); */
    //Handle comment Event
    socket.on("comment_post", ({ postId, username }) => {
        console.log(`Post ${postId}  comment by ${username}`);
        io.emit("notification", { message: `${username} comment your post!` }); // Broadcast notification
    });

    //handle friend Request event
    socket.on("notification",({action,username})=>{
        console.log(`Post ${action} friendRequest by ${action}`);
        io.emit("notification", { message: ` ${username} Friend Request ${action}ed  !` }); // Broadcast notification
    })
    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});



//Routers injection
web_server.use("/user", UserRouter)
web_server.use("/media", MediaRouter);
web_server.use("/post", PostRouter)

//create
web_server.post('/create', (req, res) => {
    res.status(200).json({
        message: "data created successfully",
        data: req.body
    })
})
//read
web_server.get("/", (req, res) => {
    res.status(200).json({
        message: "Data read success"
    })
})
//listen server
server.listen(process.env.HOST_PORT, process.env.HOST_NAME, () => {
    console.log("server started successfully");
    console.log(`http://${process.env.HOST_NAME}:${process.env.HOST_PORT}/`);
})
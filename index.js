//import express server
const express = require('express');
//http server creation
const http = require('http');
const { Server } = require('socket.io');
//import mongodb connection
require("./dbconfig")
require('dotenv').config()
var cors=require("cors");

const{ UserRouter }=require("./controller/UserController")

const web_server=express();
//body-parser
web_server.use(express.json())
web_server.use(cors())
//enable http server
const server = http.createServer(web_server);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust to match frontend URL
        methods: ["GET", "POST"]
    }
});
// Listen for client connections
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for incoming chat messages
    socket.on("send_message", (data) => {
        console.log("Message received:", data);
        io.emit("receive_message", data); // Broadcast to all clients
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

//Routers injection
web_server.use("/user",UserRouter)

//create
web_server.post('/create',(req,res)=>{
    res.status(200).json({
        message:"data created successfully",
        data:req.body
    })
})
//read
web_server.get("/",(req,res)=>{
    res.status(200).json({
        message:"Data read success"
    })
})
//listen server
web_server.listen(4000,"localhost",()=>{
    console.log("server started successfully");
    console.log("http://localhost:4000/");
})
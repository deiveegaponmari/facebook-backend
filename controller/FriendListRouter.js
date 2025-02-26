const FriendListRouter=require("express").Router();
const FriendListModel=require("../model/FriendListModel");

FriendListRouter.get("/",(req,res)=>{
    res.send("friend list router")
})

FriendListRouter.get("/data",async(req,res)=>{
    const Response=await FriendListModel.find();
    //console.log(Response);
    res.json(Response)
})
module.exports=FriendListRouter;
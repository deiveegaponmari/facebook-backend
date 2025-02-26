const FriendListRouter=require("express").Router();
const FriendListModel=require("../model/FriendListModel");

FriendListRouter.get("/friendlistdata",async(req,res)=>{
    const Response=await FriendListModel.find();
    console.log(Response);
    res.json(Response)
})
module.exports=FriendListRouter;
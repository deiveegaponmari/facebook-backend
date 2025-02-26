const NewsfeedRouter=require("express").Router();
const NewsFeedModel=require("../model/NewsfeedModel");

NewsfeedRouter.get("/data",async(req,res)=>{
    const Response=await NewsFeedModel.find();
    console.log(Response);
    res.json(Response)
})
module.exports=NewsfeedRouter;
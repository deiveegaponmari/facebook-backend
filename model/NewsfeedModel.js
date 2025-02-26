const mongoose = require("mongoose");

const NewsfeedSchema = new mongoose.Schema(
  {
   id:{
    type:Number,
   },
   username:{
    type:String
   },
   avatar:{
    type:String,
    required:true
   },
   time:{
    type:String
   },
   content:{
    type:String
   },
   media:{
    type:String,
    required:true
   },
   type:{
    type:String
   }
  },
  { timestamps: true } 
);

const NewsFeedModel = mongoose.model("Newsfeed", NewsfeedSchema);
module.exports = NewsFeedModel;

const mongoose = require("mongoose");

const FriendListSchema = new mongoose.Schema(
  {
   id:{
    type:Number,
   },
   name:{
    type:String
   },
   avatar:{
    type:String,
    required:true
   },
   lastmessage:{
    type:String
   },
  },
  { timestamps: true } 
);

const FriendListModel = mongoose.model("friendlist", FriendListSchema);
module.exports = FriendListModel;
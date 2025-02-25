const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
   senderId:{
        type:Number
    } ,
    recipientId:{
        type:Number
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;

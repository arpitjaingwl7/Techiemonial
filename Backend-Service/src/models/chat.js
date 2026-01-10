

const mongoose = require('mongoose');

const messageSchema=mongoose.Schema({
 firstName:{
        type:String,
        required:true
    },

    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'}

    ,
    text:{
        type:String,
        required:true
    }
    ,
    

    


},{timestamps:true})


const chatSchema = new mongoose.Schema({
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',},
    messages: {
        type: [messageSchema],
        default: [] 

       
    }


})

const Chat = mongoose.model('Chat', chatSchema);

module.exports = {Chat};


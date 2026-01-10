const { isUserValid } = require("../middleware/auth.middleware");
const { Chat } = require("../models/chat");

const express=require("express");


const chatRouter=express.Router();


chatRouter.get("/chat/:targetId",isUserValid,async(req,res)=>{

    try {  
        
        const userId=req.user._id;
        const targetId=req.params.targetId;

        let chat=await Chat.findOne({
            participants:{$all:[userId,targetId]}
        })

        if(!chat){

            chat = new Chat({
                participants:[userId,targetId],
                messages:[]
            })

            await chat.save();

        
    }


    res.status(200).json(chat);

}
catch (error) {
        res.status(500).json({ error: error.message });
    }
    }

)
module.exports={chatRouter};    
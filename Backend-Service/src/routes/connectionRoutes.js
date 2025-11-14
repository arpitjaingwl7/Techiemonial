

const express=require("express")
const connectionRouter=express.Router();
const {isUserValid}=require("../middleware/auth.middleware");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");


// send-1) intersted 2)ignored

connectionRouter.post("/request/send/:status/:userId",isUserValid,async(req,res)=>{

    try {
        const status=req.params.status
        const toUserId=req.params.userId
        const fromUserId=req.user._id

        // edge cases and validations required->
        // status must be ignored or interested
        // users should be differed (toUser and fromUserId)
        // userId should be present in user Model
        // no duplicate connection created
       
        const validStatus=["ignored","interested"]

        if(!validStatus.includes(status)){
            throw new Error("Invalid Status")
        }
         
        const toUser=await User.findById(toUserId)

        if(!toUser){
            throw new Error("No User found")
        }

       const  ExistingConnectionRequest= await ConnectionRequest.findOne({$or:[{toUserId,fromUserId},{toUserId:fromUserId,fromUserId:toUserId}]})

       if(ExistingConnectionRequest){
        throw new Error("Connection Request already sent")
       }
       const newConnectionRequest=new ConnectionRequest({toUserId,fromUserId,status})

       await newConnectionRequest.save()
       
     

       res.status(201).json({
        message: req.user.firstName +"sends " + status +"to " + toUser.firstName

       })


        
    } catch (error) {
        console.log(error)

        res.status(401).send(error.message)
        
    }


    
    

})

module.exports={
    connectionRouter
}
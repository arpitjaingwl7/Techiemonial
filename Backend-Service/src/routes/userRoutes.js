
const express = require("express");
const { isUserValid } = require("../middleware/auth.middleware");
const { ConnectionRequest } = require("../models/connectionRequest");
const {User}=require("../models/user")

const userRouter = express.Router();

//Api for getting all the connection request 


const safe_User_Data = "firstName lastName age gender designation about photoUrl"

userRouter.get("/user/request/recieved",isUserValid, async(req,res)=>{

    

    // connectionReq toUserID = loggedInUser 
    // status = interested
try {
    
        const loggedInUser = req.user

        
        const userRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId" , safe_User_Data)


        res.status(200).json({
            message: "Successfully fetched User request",
            data:userRequests
        })



    
} catch (error) {
    res.status(400).send("Error: " + error.message)
}


})





//Api for getting all the connections 


userRouter.get( "/user/request/connections",isUserValid,async(req,res)=>{

    //status of connectionrequest should be accepted
    // find loggedinUserId should match either toUserID or fromUserID of connectionrequest

    try {
        

        const loggedInUser = req.user

        const  connectionRequests = await ConnectionRequest.find({
            
            $or:[{
                toUserId:loggedInUser._id,
                status:"accepted"
            },{
                fromUserId:loggedInUser._id,
                status:"accepted"
            }]
        }).populate("toUserId",safe_User_Data)
          .populate("fromUserId",safe_User_Data)

          const data = connectionRequests.map((key)=>{
            //   console.log(key.fromUserId)
            //   console.log(loggedInUser._id)
            if(key.fromUserId.equals(loggedInUser._id)){
                return key.toUserId
            }
                return key.fromUserId;
          })


          return res.status(200).json({
            message:"Successfully fetched all connections",
            data: data
            
          })

    
      
    } catch (error) {
        res.status(400).send("Error: "+ error.message)
    }



})

// APi for getting feed


userRouter.get("/user/feed",isUserValid,async(req,res)=>{


    // feed should not consist of user self and any other excisting connectioRequest with loggedin user
    // pagination


    try {
        const loggedInUser=req.user

        const page=req.query.page||1
        let limit=req.query.limit||10

        if(limit>5){
            limit=5
        }


        const skip=(page-1)*limit

        const connectionRequests=await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
        })
        const hiddenUser=new Set()

        connectionRequests.forEach(cr => {
            hiddenUser.add(cr.toUserId)
            hiddenUser.add(cr.fromUserId)
        });

        const feedUserData=await User.find({_id:{$nin:Array.from(hiddenUser)}}).select(safe_User_Data).skip(skip).limit(limit)

     res.status(200).json({
        message:"data fetched successfuly",
        data:feedUserData
     })


    } catch (error) {

        res.status(401).json({message:error.message})   
    }
})


module.exports = {userRouter}
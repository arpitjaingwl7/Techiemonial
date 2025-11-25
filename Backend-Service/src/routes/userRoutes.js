
const express = require("express");
const { isUserValid } = require("../middleware/auth.middleware");
const { ConnectionRequest } = require("../models/connectionRequest");
const {User}=require("../models/user")
const mongoose = require("mongoose");

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


userRouter.get("/user/feed", isUserValid, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 20;

        if (limit > 20) {
            limit = 20; // Enforce max limit
        }

        const skip = (page - 1) * limit;

        // 1. Determine users to hide (self + those with existing connection requests)
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select('fromUserId toUserId -_id');

        const hiddenUserIds = new Set();
        hiddenUserIds.add(loggedInUser._id.toString()); // Always hide self

        connectionRequests.forEach(cr => {
            // Note: Ensure these are converted to strings if they are Mongoose ObjectIds
            hiddenUserIds.add(cr.toUserId.toString());
            hiddenUserIds.add(cr.fromUserId.toString());
        });
        
        // Convert Set of String IDs to Array of Mongoose ObjectIds for $nin
        const hiddenObjectIds = Array.from(hiddenUserIds).map(id => new mongoose.Types.ObjectId(id));

        // 2. Aggregation Pipeline to Fetch Users, Paginate, and Calculate Match Count
        const feedUserData = await User.aggregate([
            {
                // Stage 1: Filter out excluded users (self and existing connections)
                $match: {
                    _id: { $nin: hiddenObjectIds }
                }
            },
            {
                // Stage 2: Pagination
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                // Stage 3: Lookup ConnectionRequests to find accepted matches for the current user
                $lookup: {
                    from: "connectionrequests", // **Ensure this matches your actual collection name (e.g., 'connectionrequests')**
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        // Filter for accepted connections
                                        { $eq: ["$status", "accepted"] },
                                        {
                                            $or: [
                                                // Check if the current user is either fromUserId or toUserId
                                                { $eq: ["$fromUserId", "$$userId"] },
                                                { $eq: ["$toUserId", "$$userId"] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        // Count the total number of accepted connections found
                        { $count: "matchCount" } 
                    ],
                    as: "matchData" // The result of the pipeline (an array)
                }
            },
            {
                // Stage 4: Reshape the output documents
                $project: {
                    // Include all fields from the original user document that are covered by safe_User_Data
                    // NOTE: You must explicitly list all fields you need from safe_User_Data here:
                    _id: 1, 
                    firstName: 1, 
                    lastName: 1, 
                
                    age: 1,
                    profilePic: 1,
                    designation: 1,
                    about: 1,
                    role: 1,
                    gender:1,
                    
                    // ... list other fields from safe_User_Data (e.g., profilePic, role, etc.)

                    // Extract the matchCount, defaulting to 0 if the lookup array is empty
                    matchCount: { 
                        $ifNull: [{ $arrayElemAt: ["$matchData.matchCount", 0] }, 0]
                    }
                }
            }
        ]);

        res.status(200).json({
            message: "data fetched successfully",
            data: feedUserData
        });

    } catch (error) {
        // You might need to import mongoose for the error message to be cleaner if the aggregation fails
        res.status(401).json({ message: error.message });
    }
});

module.exports = {userRouter}
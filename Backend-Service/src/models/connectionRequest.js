const mongoose= require("mongoose")

const connectionRequestSchema=mongoose.Schema({

    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true

    },
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true

    },
    status:{
     type:String,
     enum:{
        values:["ignored","interested","accepted","rejected"],
        message:"please provide correct status"
     }
    }

})

connectionRequestSchema.index({toUserId:1,fromUserId:1})

connectionRequestSchema.pre("save",function(next){

   try {
     const connectionRequst=this
     const {toUserId,fromUserId}=connectionRequst


     if(toUserId.equals(fromUserId)){
        throw new Error("Please Provide a Different User")
     }

     next()
 
   } catch (error) {
     
    next(error)
   }







})


const ConnectionRequest= mongoose.model("ConnectionRequest",connectionRequestSchema)



module.exports={
    ConnectionRequest,
}
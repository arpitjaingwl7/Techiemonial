

const jwt=require("jsonwebtoken")

const {User} =require("../models/user")
const cookieParser = require("cookie-parser");
// app.use(cookieParser());


const isUserValid = async(req,res,next)=>{
    

    try {

        const {token} =req.cookies

        if(!token){
            throw new Error("please Login First")
        }
      
   const payload = jwt.verify(token, "user@123");
        
        // 3. Fix: Use the '_id' from the payload to find the user.
        const user = await User.findById(payload._id);
     

    // const user=await User.findById(_id)

    if(!user){
        throw new Error("please login first")
    }
     
    req.user=user;
    next()
     
    } catch (error) {
        res.status(500).send("error :"+error)
    }

}

module.exports = {isUserValid}

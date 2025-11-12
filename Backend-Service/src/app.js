const express= require("express");
const { isUserValid } = require("./middleware/auth.middleware");
const dbConnect=require("./config/database.js")
const {User}=require("./models/user.js")
const bcrypt = require("bcryptjs");
// var cookieParser = require('cookie-parser')
const cookieParser = require("cookie-parser");
const {userValidator}=require("./utils/userValidator.js")

const app=express();

const validator=require("validator")
app.use(express.json())


app.use(cookieParser());


dbConnect().then(()=>{
    console.log("Database connected Succesfuly")}
)



.then(()=>{
    app.listen(7777,()=>{
    console.log("Server running on 7777")
})
})

.catch((err)=>{
   console.error(err)
})





// api for signup
app.post("/user/signup",async (req,res)=>{

// Data validation and sanitization
// Password Encryption
// save to DB



try {
    
    const {email, password, firstName, lastName,photoUrl}=req.body;

    if(!email || !password || !firstName || !lastName){
        throw new Error("Missing Required Fields")
    }

    const dbUser=await User.findOne({email});
    if(dbUser!=undefined){
        throw new Error("User already exist!!")
    }

    userValidator(req);

     
    // if(!validator.isURL(photoUrl)){
    //    throw new Error("not a URL")
    // }
        
    
        const encryptedPassword = await bcrypt.hash(password,10);
        const user=new User({
            email,
            password:encryptedPassword,
            firstName,
            lastName,
            photoUrl
        });
      
        await user.save()
        // res.cookie("dummy","hadwdjaewfnaekjf");
     
        res.status(201).send(user);
    
} catch (error) {
    res.status(501).send("error :"+error)
}



})




app.post("/user/login",async(req,res)=>{

    try {
        
        const {email,password} = req.body;

        const user = await User.findOne({email})

        if(!user){
            throw new Error("please signup first")
        }

        const isPasswordCorrect = await user.isPasswordValid(password)
        if(!isPasswordCorrect){
            throw new Error("Invalid Credentials")
        }


        const token= await user.getjwt()

        console.log(token)

        res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true in production (with HTTPS)
  sameSite: "lax",
  expires:new Date(Date.now()+1000000000)
});

        res.status(201).send("Login successfully")




    } catch (error) {
        res.status(501).send("error :"+error)
    }

})






// get user Profile
app.get("/user/profile", isUserValid ,async(req,res)=>{
   

    const user=req.user

    try {
   
        res.send(user)

        
    } catch (error) {
        res.status(501).send("error :"+error)
    }
})



app.post("/user/getInfoByEmail",async (req,res)=>{

try {
        
    const {email}=req.body

        const user = await User.findOne({email})

        
        res.status(201).send(user);
    
} catch (error) {
    res.status(501).send(error)
}


})

// api for getting user info
app.get("/user/:id",async (req,res)=>{

try {
        const userId = req.params.id

        const user = await User.findById(userId)

        if(!user){
            res.status(404).send("User not found");
        }
        res.status(201).send(user);
    
} catch (error) {
    res.status(501).send(error)
}


})

// api for deleting user
app.delete("/user/:id",async (req,res)=>{

try {
        
        const userId = req.params.id
        const user = await User.findByIdAndDelete(userId)

        res.status(201).send("User Deleted Successfully");
    
} catch (error) {
    res.status(501).send(error)
}


})

// api for updating user
app.patch("/user/update", async (req, res) => {
  try {
    const { email, ...newUser } = req.body;

    const user = await User.findOneAndUpdate(
      { email },       // filter
      newUser,         // updated data
      { new: true }    // return updated doc (optional)
    );

    if (!user) return res.status(404).send("User not found");

    res.status(200).send("User Updated Successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

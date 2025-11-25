const express= require("express");
const { isUserValid } = require("./middleware/auth.middleware");
const dbConnect=require("./config/database.js")
const {User}=require("./models/user.js")
const cookieParser = require("cookie-parser");
const cors=require("cors");
const app=express();

const validator=require("validator");
const { authRouter } = require("./routes/authRoutes.js");
const { profileRouter } = require("./routes/profileRoutes.js");
const {connectionRouter}=require("./routes/connectionRoutes.js");
const { userRouter } = require("./routes/userRoutes.js");

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies
  })
);
app.use(express.json())
app.use(cookieParser())

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


app.use(authRouter)
app.use(profileRouter)
app.use(connectionRouter)
app.use(userRouter)

app.get("/test",(req,res)=>{
    res.send("Welcome to Techniemonial Backend Service")
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

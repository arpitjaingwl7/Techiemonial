const express= require("express");
const { isUserValid } = require("./middleware/auth.middleware");
const dbConnect=require("./config/database.js")
const app=express();
const {User}=require("./models/user.js")


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
app.get("/user/sighnup",async (req,res)=>{
// changed
const a=5;
const b=45;
console.log(b)
try {
     
        const newUser={
            name:"Shubham1",
            email:"a@gma112il.11com",
            password:"12345"
        }
        
        const user=new User(newUser);
      
    
       const prom=await user.save()
    
     
        res.status(201).send(user);
    
} catch (error) {
    res.status(501).send(error)
}


})
const express= require("express")

const app=express();




// app.get("/a",(req, res)=>{
//     res.send("this is  homepage")
// })



// app.get("/a/bcd",(req, res)=>{
//     res.send("this is  455")
// })
// app.use("/",(req,res)=>{
    
//     res.send("Workin fine")


// })

// app.get("/a+",(req,res)=>{
//     res.send("hello")
// }
// )
app.get(/^\/abcc?$/, (req, res) => {
  res.send("This will match /abc and /abcc");
});



app.get("/user",(req,res)=>{

    
      res.send(req.query?.name)})
// dynamic route
app.get("/user/:id",(req,res)=>{
   res.send({id:req.params.id})
})

// 
// app.get("/user",(req,res)=>{
//    res.send()
// })






app.listen(7777,()=>{
    console.log("Server running on 7777")
})


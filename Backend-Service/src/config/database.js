
const  mongoose=require("mongoose")


const  dbConnect=async()=>{


       await  mongoose.connect("mongodb+srv://arpitjainmits_db_user:123456789%40@cluster0.qvljrke.mongodb.net/techiemonialDB?retryWrites=true&w=majority"
    )


}
    
module.exports=dbConnect

    

const mongoose = require("mongoose")
const jwt= require("jsonwebtoken")

const bcrypt=require("bcryptjs")
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength:4,
        maxlength:50
    },
    lastName: {
        type: String,
        required: true,
        minlength:3,
        maxlength:50
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim:true,
        lowercase:true, 
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min:18,
        max:100,
    }
    ,
    designation: {

        type: String,
        default:"Developer",
    },
    gender:{
          type:String,
          lowercase:true,

          validate(value){
            if(value!="male"&&value!="female"){
                throw new Error("select correct gender")
            }
          }

    }
    ,
    photoUrl:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Favatar-placeholder.iran.liara.run%2F&psig=AOvVaw0Rut3-mYGdx6pOrJs1MyHU&ust=1762432708204000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKiBns6D25ADFQAAAAAdAAAAABAE"
    }
    ,
    skills:{
        type:[String]
    },
    about:{
        type:String,
        default:"this is default msg"
    }

},{timestamps:true})



// validate password

userSchema.methods.isPasswordValid=async function (inputPassword){
    
    try {
        const user=this
        const encryptedPassword=user.password

       const isValid=await bcrypt.compare(inputPassword,encryptedPassword)

       return isValid

    } catch (error) {
          throw new Error(error) 
    }
}




// getjwt

userSchema.methods.getjwt=async function(){
  try {
    const  user=this
    const token= await jwt.sign({_id:user._id},"user@123",{expiresIn:"1d"});
  
   return token
  } catch (error) {
   throw new Error(error) 
  }
   

}

const User = mongoose.model("User", userSchema);
module.exports = {
    User,
    
}



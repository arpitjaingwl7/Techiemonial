
const express = require("express");
const { isUserValid } = require("../middleware/auth.middleware");
const { profileUpdateValidator } = require("../utils/userValidator");
const bcrypt = require("bcryptjs")

const profileRouter  = express.Router()

//profile/view
profileRouter.get("/profile/view",isUserValid,async(req,res)=>{

    try {
        
        const user = req.user;

        if(!user){
            throw new Error("please login first 1")
        }

        res.status(201).send(user);
        
    } catch (error) {
        res.status(501).send("error :"+error)
    }

})

//profile/edit

profileRouter.post("/profile/edit",isUserValid, async(req,res)=>{
    try {
        
        profileUpdateValidator(req)

        Object.keys(req.body).forEach((key)=>{
            req.user[key]=req.body[key]
        })

        await req.user.save();

        res.status(200).json({
            message: req.user.firstName + " Profile Successfully updated ",
            data:req.user
        })

    } catch (error) {
        res.json({
            message:"error : "+ error
        })
    }
})
// req.user = user
// isEditsAllowed 
// foreach har ek key req.body aur req.body key or jo isEditAllowedkey usse match kerga use update hoga
// await user.save()


//password
// old password -> compare if ti okay then continue 
// otp on email -> correct otp
// input new password usko encrypt karke save krenge

//
profileRouter.patch("/profile/forgetPassword",isUserValid, async(req,res)=>{

    try {
        
        const user = req.user
    
        const isOldPasswordValid = await user.isPasswordValid(req.body.oldPassword)
    
        if(!isOldPasswordValid){
            res.status(400).json({
                message:"Old Password is incorrect"
            })
        }

        const userNewPassword = req.body.newPassword;

        const encryptedPassword = await bcrypt.hash(userNewPassword,10)

        user.password = encryptedPassword;  
        
        await user.save();

        res.status(200).json({
            message:"Password updated successfully",
            data: user
        })
    } catch (error) {
            res.status(500).json({
                message: "error:" + error
            })
    }

})



module.exports = {profileRouter}
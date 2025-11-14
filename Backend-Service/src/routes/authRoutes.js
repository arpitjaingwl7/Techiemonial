
const { User } = require("../models/user");
const { userValidator } = require("../utils/userValidator");
const bcrypt = require("bcryptjs");
const express = require("express");
const cookieParser = require("cookie-parser");


const authRouter = express.Router();

// login 
authRouter.post("/user/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            throw new Error("please signup first")
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            throw new Error("Invalid Credentials")
        }

        const token = await user.getjwt();

        res.status(201).cookie("token", token, { httpOnly: true }).send(user.firstName+" Login successfully")

    } catch (error) {
        res.status(501).send("error :" + error)
    }

})


// signup
authRouter.post("/user/signup", async (req, res) => {

    // Data validation and sanitization
    // Password Encryption
    // save to DB

    try {

        const { email, password, firstName, lastName, photoUrl } = req.body;

        if (!email || !password || !firstName || !lastName) {
            throw new Error("Missing Required Fields")
        }

        const dbUser = await User.findOne({ email });
        if (dbUser != undefined) {
            throw new Error("User already exist!!")
        }

        userValidator(req);


        // if(!validator.isURL(photoUrl)){
        //    throw new Error("not a URL")
        // }


        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: encryptedPassword,
            firstName,
            lastName,
            photoUrl
        });

        await user.save()

        res.status(201).send(user);

    } catch (error) {
        res.status(501).send("error :" + error)
    }

})


//logout

authRouter.post("/user/logout", async (req, res) => {
    try {
        

        res.cookie("token",{expires:new Date(Date.now())})

        res.clearCookie("token").json({
            message:"Logout Successfully"
        })

    } catch (err) {
        res.json({
            message: "error : "+ err
        })
    }
})


module.exports = { authRouter }
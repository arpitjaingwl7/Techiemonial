

const express = require("express");
const { authRouter } = require("./authRoutes");
const rzpInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { isUserValid } = require("../middleware/auth.middleware");
const price = require("../utils/price");
const { BASE_URL } = require("../../../frontend-service/utils/constants");
const paymentRouter = express.Router();
/* NODE SDK: https://github.com/razorpay/razorpay-node */
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const { User } = require("../models/user");





paymentRouter.post("/payment/create", isUserValid, async (req, res) => {
    try {

        const {membershipType }= req.body

        const { firstName, lastName } = req.user
        const order = await rzpInstance.orders.create({
            amount: (price[membershipType])*100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName,
                lastName,
                membershipType

            }


        })
        const { amount, currency, id: orderId, status, notes } = order
        const newPayment = new Payment({
            amount, orderId, status, currency, notes, user: req.user._id
        })

        const  payment=await newPayment.save();
        res.json({ ...payment.toJSON() , key_id:"rzp_test_RppCP35Tr7wFhK"})



    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

paymentRouter.post("/payment/webhook",async(req,res)=>{

    try {
        const webhookSignature=req.get("X-Razorpay-Signature")

    const isWebHookValid= validateWebhookSignature(JSON.stringify(req.body), webhookSignature, "tanya_sharma")

    if(!isWebHookValid){
        res.status(500).json({
            message:"WebHook is invalid"
        })
    }

    
    // update the status of payment in database
    const paymentDetails=req.body.payload.payment.entity
    const payment=await Payment.findOne({
        orderId:paymentDetails.order_id

    })
    payment.status=paymentDetails.status
    await payment.save()

   

    if(req.body.event==="payment.captured"){

 // update the user (isPremium=true/false)

    const user=await User.findById({
       _id:payment.user 
    })

    user.isPremium=true
    user.premiumType=payment.notes.membershipType
    await user.save();
    }
  

    res.status(200).json({
        message:"Webhook called successfully"
    })
        
    } catch (error) {

        res.status(500).json({
            error:error.message
        })
        
    }
    
})


module.exports = paymentRouter

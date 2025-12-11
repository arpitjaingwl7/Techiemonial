

const mongoose = require("mongoose")
const { User } = require("./user")


const paymentSchema = mongoose.Schema({


    amount: {
        type: Number
        ,
        required: true


    },
    currency: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    }
    ,
    status: {
        type: String,
        required: true
    },
    notes: {

        membershipType: {
            type: String
            ,
            required: true
        },
        firstName: {
            type: String
            ,
            required: true
        }
        ,
        lastName: {
            type: String,
            required: true
        },

    },

    paymentId: {
        type: String
    }


})

const Payment = mongoose.model("Payment", paymentSchema)

module.exports = Payment
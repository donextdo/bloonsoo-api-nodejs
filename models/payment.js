import mongoose from 'mongoose'

const PaymentSchema = mongoose.Schema({
    hotel_name: {
        type: String,
        // required: true
    },
    total_sale_amount: {
        type: Number
    },
    amount: {
        type: Number
    },
    payment_status: {
        type: String,
        enum: ["pending", "approved", ],
        default: "pending",
      },
    payment_method: {
        type: String,
        enum: ["offline", "online", ],
        default: "offline",
    },
    bloonsoo_discount: {
        type: Number,
    },
    hotel_discount: {
        type: Number,
        
    },
    
    commission_rate: {
        type: Number,
    },
    commission: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now,
    }
},

)

const Payment = mongoose.model('Payment', PaymentSchema)

export default Payment
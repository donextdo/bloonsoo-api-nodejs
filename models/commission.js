import mongoose from 'mongoose'

const CommissionSchema = new mongoose.Schema(
    {
        hotel_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotel',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        booking_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true
        },
        booking_amount: {
            type: Number,
            required: true
        },
        commission_rate: {
            type: Number
        },
        commission: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Commission = mongoose.model("Commission", CommissionSchema);

export default Commission
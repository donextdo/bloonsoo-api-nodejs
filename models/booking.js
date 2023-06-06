import mongoose from 'mongoose'

const BookingSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    full_name: {
        type: String
    },
    email: {
        type: String
    },
    country: {
        type: String,
    },
    mobile: {
        type: String,
    },
    arrival_time: {
        type: String,
    },
    total: {
        type: String,
        required: true
    },
    booked_rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookedRoom'
    }],
    status: {
        type: Number,
        default: 0
    },
    payment_method: {
        type: Number
    },
    is_travelling_for_work: {
        type: Boolean
    },
    commission_rate: {
        type: Number,
    },
    commission: {
        type: Number
    }
},
{ timestamps: true }
)

const Booking = mongoose.model('Booking', BookingSchema)

export default Booking
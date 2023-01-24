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
    first_name: {
        type: String,
    },
    last_name: {
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
    }]
})

const Booking = mongoose.model('Booking', BookingSchema)

export default Booking
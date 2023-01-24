import mongoose from "mongoose";
import Booking from "./booking.js";

const BookedRoomSchema = mongoose.Schema(
    {
        room_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },
        room_type: {
            type: String,
        },
        room_name: {
            type: String,
        },
        booking_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true
        },
        check_in: {
            type: Date,
            required: true
        },
        check_out: {
            type: Date,
            required: true
        },
        nights: {
            type: Number,
            default: 1
        },
        adults: {
            type: Number,
            default: 1
        },
        children: {
            type: Number,
            default: 0
        },
        rooms: {
            type: Number,
            default: 1
        },
        total: {
            type: String,
            required: true
        }
    }
)

BookedRoomSchema.post('save', async (doc) => {
    await Booking.findOneAndUpdate({
        _id: doc.booking_id
    },
    {
        $push: {booked_rooms: doc._id}
    })
})

const BookedRoom = mongoose.model('BookedRoom', BookedRoomSchema)

export default BookedRoom
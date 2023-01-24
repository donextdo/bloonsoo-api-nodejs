import Booking from "../models/booking.js";
import BookedRoom from "../models/bookedRoom.js";
import Hotel from "../models/hotel.js";

const addBooking = async (req, res, next) => {
    try {
        
        const user_id = req.user._id

        const newBooking = new Booking({
            user_id,
            hotel_id: req.body.hotel_id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            country: req.body.country,
            mobile: req.body.mobile,
            arrival_time: req.body.arrival_time,
            total: req.body.total
        })

        const booking = await newBooking.save()

        let bookedRooms = req.body.bookings 

        bookedRooms = bookedRooms.map(bookedRoom => {
            return {
                room_id: bookedRoom.id,
                room_type: bookedRoom.roomType,
                room_name: bookedRoom.roomName,
                booking_id: booking._id,
                check_in: bookedRoom.checkInDate,
                check_out: bookedRoom.checkOutDate,
                nights: bookedRoom.nights,
                adults: bookedRoom.adults,
                children: bookedRoom.children,
                rooms: bookedRoom.rooms,
                total: bookedRoom.totalPrice
            }
        })

        await BookedRoom.create(bookedRooms)

        res.status(201).json(booking)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const getAllBookings = async(req, res, next) => {
    try {
        
        if(req.user.role === 'admin') {
            const bookings = await Booking.find().populate('booked_rooms')
            .populate({
                path: 'hotel_id',
                select: 'property_name'
            })
            .sort({_id: -1})
            return res.status(200).json(bookings)
        }

        const userHotels = await Hotel.find({
            user: req.user._id 
        })

        const hotelIds = userHotels.map(hotel => (hotel._id))

        const bookings = await Booking.find(
            {
                hotel_id: { $in: hotelIds }   
            }
        ).populate('booked_rooms')
        .populate({
            path: 'hotel_id',
            select: 'property_name'
        })

        res.status(200).json(bookings)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const getMyBookings = async(req, res, next) => {
    try {
        
        const bookings = Booking.find({
            user_id: req.user._id
        }).populate('booked_rooms')

        res.status(200).json(bookings)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export default {
    addBooking,
    getAllBookings,
    getMyBookings
}
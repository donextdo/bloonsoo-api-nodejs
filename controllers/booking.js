import Booking from "../models/booking.js";
import BookedRoom from "../models/bookedRoom.js";
import Hotel from "../models/hotel.js";
import User from '../models/user.js'
import CommissionRate from "../models/commissionRate.js";
import Commission from "../models/commission.js";
import { NotFoundError } from "../errors/errors.js";
import { BookingStatus } from "../utils/constants/booking-status.js";
import { StatusCodes } from "http-status-codes";
import sendEmail from "../utils/email/sendEmail.js";
import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename)

const bookingTemplateClient = fs.readFileSync(path.join(__dirname, '../utils/email/booking-info.ejs'), 'utf-8');
const bookingTemplateHotel = fs.readFileSync(path.join(__dirname, '../utils/email/booking-info-hotel.ejs'), 'utf-8');
const bookingApproved = fs.readFileSync(path.join(__dirname, '../utils/email/booking-approve.ejs'), 'utf-8');
const bookingReject = fs.readFileSync(path.join(__dirname, '../utils/email/booking-reject.ejs'), 'utf-8');

const bloonsoAdminBooking = process.env.BLOONSOO_ADMIN_BOOKING
const bloonsoWeb = process.env.BLOONSOO_WEB

const addBooking = async (req, res, next) => {
    try {

        const user_id = req.user._id.toString()
        const commissionRate = await CommissionRate.find()

        const RATE = commissionRate[0].commission_rate

        const totalAmount = req.body.total

        // const amount = parseInt(totalAmount.split(' ')[1]) 
        const amount = totalAmount


        const commission = amount * (RATE / 100)


        const newBooking = new Booking({
            user_id,
            hotel_id: req.body.hotel_id,
            full_name: req.body.full_name,
            email: req.body.email,
            country: req.body.country,
            mobile: req.body.mobile,
            arrival_time: req.body.arrival_time,
            total: req.body.total,
            payment_method: req.body.payment_method,
            is_travelling_for_work: req.body.is_travelling_for_work,
            commission_rate: RATE,
            commission: commission
        })

        const booking = await newBooking.save()

        let bookedRooms = req.body.bookings
        console.log(bookedRooms)
        try {
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
        } catch (error) {
            console.log(error)
        }
        console.log("hi")
        const hotel = await Hotel.findById(req.body.hotel_id)

        const hotelAdmin = await User.findById(hotel.user)

        await BookedRoom.create(bookedRooms)

        const data = {
            customerName: req.body.full_name,
            bookind_id: booking._id,
            property_name: hotel.property_name,
            total: req.body.total,
            url: bloonsoWeb
        };
        const renderedTemplate = ejs.render(bookingTemplateClient, data);

        await sendEmail(
            `Booking Confirmation: ${booking._id}`,
            req.body.email,
            renderedTemplate
        )

        const dataHotelEmail = {
            property_name: hotel.property_name,
            customerName: req.body.full_name,
            bookind_id: booking._id,
            commission: commission,
            total: req.body.total,
            url: bloonsoAdminBooking
        };

        const renderedTemplateHotel = ejs.render(bookingTemplateHotel, dataHotelEmail);

        const email = await sendEmail(
            `New Booking: ${booking._id}`,
            hotelAdmin.email,
            renderedTemplateHotel
        )

        console.log(email)

        res.status(201).json(booking)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const getAllBookings = async (req, res, next) => {
    try {

        if (req.user.role === 'admin') {
            const bookings = await Booking.find()
                .populate({
                    path: 'hotel_id',
                    select: 'property_name'
                })
                .populate({
                    path: 'user_id',
                    select: ['firstName', 'lastName', 'email', 'username']
                })
                .populate('booked_rooms')
                .sort({ _id: -1 })
            return res.status(200).json(bookings)
        }

        const userHotels = await Hotel.find({
            user: req.user._id.toString()
        })

        const hotelIds = userHotels.map(hotel => (hotel._id))

        const bookings = await Booking.find(
            {
                hotel_id: { $in: hotelIds }
            }
        )
            .populate({
                path: 'hotel_id',
                select: 'property_name'
            })
            .populate({
                path: 'user_id',
                select: ['firstName', 'lastName', 'email', 'username']
            })
            .populate('booked_rooms')
            .sort({ _id: -1 })

        res.status(200).json(bookings)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const getMyBookings = async (req, res, next) => {
    try {

        const bookings = await Booking.find({
            user_id: req.user._id.toString()
        }).populate({
            path: 'hotel_id',
            select: ['property_name', 'property_address']
        }).populate('booked_rooms')
            .sort({ _id: -1 })

        res.status(200).json(bookings)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const getBookingById = async (req, res, next) => {
    try {

        const id = req.params.id

        const booking = Booking.findById(id).populate({
            path: 'hotel_id',
            select: 'property_name'
        })

        if (booking.user_id !== req.user._id.toString())
            return res.status(403).json({
                code: 'UNAUTHORIZED',
                message: 'You are not allowed to do this'
            })

        const bookedRooms = await BookedRoom.find({
            booking_id: id
        })

        res.status(200).json({
            booking,
            bookedRooms
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const approveBooking = async (req, res, next) => {
    try {
        const id = req.params.id
        const user_id = req.user._id.toString()

        const bookingExist = await Booking.findById(id)

        if (!bookingExist) {
            throw new NotFoundError('BOOKING_NOT_FOUND')
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: BookingStatus.APPROVED
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
        console.log(booking)
        console.log("aaaaa")

        const totalAmount = booking.total
        const amount = parseInt(totalAmount.split(' ')[1])

        const newCommission = new Commission({
            hotel_id: booking.hotel_id,
            user_id: user_id,
            booking_id: booking._id,
            booking_amount: booking.total,
            commission_rate: booking.commission_rate,
            commission: booking.commission
        })

        const commission = await newCommission.save()

        const hotel = await Hotel.findById(booking.hotel_id)

        const data = {
            customerName: booking.full_name,
            bookind_id: booking._id,
            property_name: hotel.property_name,
            total: booking.total,
            url: bloonsoWeb
        };
        const renderedTemplate = ejs.render(bookingApproved, data);

        await sendEmail(
            `Booking Approved: ${booking._id}`,
            booking.email,
            renderedTemplate
        )

        res.status(StatusCodes.OK).json({
            booking,
            commission
        })
    }
    catch (error) {
        console.log("bbbb")
        console.log(error)
        next(error)
    }
}


const cancelBooking = async (req, res, next) => {
    try {
        const id = req.params.id

        const bookingExist = await Booking.findById(id)

        if (!bookingExist) {
            throw new NotFoundError('BOOKING_NOT_FOUND')
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: BookingStatus.CANCELLED
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        const hotel = await Hotel.findById(booking.hotel_id)

        const data = {
            customerName: booking.full_name,
            property_name: hotel.property_name
        };
        const renderedTemplate = ejs.render(bookingReject, data);

        await sendEmail(
            `Booking Rejected: ${booking._id}`,
            booking.email,
            renderedTemplate
        )

        res.status(200).json({
            success: true,
            message: 'booking rejected'
        })
    }
    catch (error) {
        next(error)
    }
}


const getBookingCount = async (req, res, next) => {
    try {

        if (req.user.role === 'admin') {
            const bookings = await Booking.countDocuments({
                status: 1
            })

            return res.status(200).json(bookings)
        }

        const userHotels = await Hotel.find({
            user: req.user._id.toString()
        })

        const hotelIds = userHotels.map(hotel => (hotel._id))

        const bookings = await Booking.countDocuments(
            {
                hotel_id: { $in: hotelIds },
                status: 1
            }
        )

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
    getMyBookings,
    getBookingById,
    approveBooking,
    cancelBooking,
    getBookingCount
}
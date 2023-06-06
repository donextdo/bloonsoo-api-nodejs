import Commission from '../models/commission.js'
import CommissionRate from '../models/commissionRate.js'
import { StatusCodes } from 'http-status-codes'
import {
    NotFoundError,
    ForbiddenError,
    BadRequestError,
    InternalServerError
} from '../errors/errors.js'


const changeCommisonRate = async (req, res, next) => {
    try {
        await CommissionRate.deleteMany()

        const rate = req.body.rate 

        console.log(rate)
        const newRate = new CommissionRate({
            commission_rate: rate
        })

        await newRate.save()

        res.status(StatusCodes.OK).json({
            success: true,
            message: 'COMMISSION_RATE_CHANGE'
        })
    }
    catch (error) {
        next(error)
    }
}


const addCommission = async (req, res, next) => {
    try {

        const user_id = req.user._id.toString()

        let rate = await CommissionRate.find()
        
        const newCommission = new Commission({
            hotel_id: req.body.hotel,
            user_id: user_id,
            booking_id: req.body.booking_id,
            booking_amount: req.body.booking_amount,
            commission_rate: rate[0].commission_rate,
            commission: req.body.commission
        })

        const commission = await newCommission.save()

        res.status(StatusCodes.OK).json(commission)

    }
    catch (error) {
        next(error)
    }
}


const getCommissionRate = async (req, res, next) => {
    try {
        const rate = await CommissionRate.find()

        if(rate.length === 0) {
            return res.status(StatusCodes.OK).json({
                rate: 0
            })
        }

        console.log(rate)

        res.status(StatusCodes.OK).json({
            rate: rate[0].commission_rate
        })
    }
    catch (error) {
        next(error)
    }
}


const getCommissionData = async (req, res, next) => {
    try {
        const commissionData = await Commission.find()
            .populate({path: 'hotel_id', select: 'property_name'})
            .populate({path: 'user', select: ['firstName', 'lastName', 'email']})
            .sort({createdAt: -1})

        res.status(StatusCodes.OK).json(commissionData)
    }
    catch (error) {
        next(error)
    }
}


const getTotalCommission = async (req, res, next) => {
    try {
        const total = await Commission.aggregate([
            { $group: { _id: null, total: { $sum: "$commission" } } }
        ])

        res.status(StatusCodes.OK).json(total)
    }
    catch (error) {
        next(error)
    }
}


export default {
    changeCommisonRate,
    addCommission,
    getCommissionRate,
    getCommissionData,
    getTotalCommission
}
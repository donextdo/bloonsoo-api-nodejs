// import Payment from "../models/payment";

// const saveApprovedBookings = async (req, res, next) => {
//     try {

//         const newPayment = new Payment({
            
//             hotel_name: req.body.hotel_name,
//             total_sale_amount : req.body.total_sale_amount,
//             amount : req.body.amount, 
//             payment_status :req.body.payment_status,
//             payment_method : req.body.payment_method,
//             bloonsoo_discount : req.body.bloonsoo_discount,
//             hotel_discount : req.body.hotel_discount,
//             commission_rate: req.body.commission_rate,
//             commission: req.body.commission,
//             date: new Date ()
//         })

//         const savePayment = await newPayment.save()

//         res.status(201).json(savePayment)

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }



// export default {
//     saveApprovedBookings
// }
import { Router } from "express";

import {
  AuthenticatedMiddleware,
  AuthenticatedAdminMiddleware,
  AuthenticatedHotelAdminMiddleware,
} from "../middleware/authenticated.js";

import bookingController from '../controllers/booking.js'



const router = Router();

const path = '/booking'
const pathPayment = '/payment'



router.post(
  path, 
  AuthenticatedMiddleware, 
  bookingController.addBooking
);

router.get(
  path, 
  AuthenticatedHotelAdminMiddleware, 
  bookingController.getAllBookings
)

router.get(
  `${path}/my/bookings`, 
  AuthenticatedMiddleware, 
  bookingController.getMyBookings
)

router.get(
  `${path}/:id`, 
  AuthenticatedMiddleware, 
  bookingController.getBookingById
)

router.patch(
  `${path}/approve/:id`,
  AuthenticatedHotelAdminMiddleware,
  bookingController.approveBooking
)

router.patch(
  `${path}/cancel/:id`,
  AuthenticatedHotelAdminMiddleware,
  bookingController.cancelBooking
)

router.get(
  `${path}/get/booking-count`,
  AuthenticatedHotelAdminMiddleware,
  bookingController.getBookingCount
)

router.get(
  `${path}/get/pending-count`,
  AuthenticatedHotelAdminMiddleware,
  bookingController.PendingBookingCount
)

router.get(
  `${path}/get/reject-count`,
  AuthenticatedHotelAdminMiddleware,
  bookingController.RejectBookingCount
)

router.post(
  pathPayment, 
  AuthenticatedHotelAdminMiddleware, 
  bookingController.saveApprovedBookings
)

router.get(
  pathPayment, 
  AuthenticatedHotelAdminMiddleware, 
  bookingController.getAllPayments
)

router.patch(
  `${pathPayment}/approve/:id`, 
  AuthenticatedHotelAdminMiddleware, 
  bookingController.approvedPayment
)

router.get(
  `${pathPayment}/get/approve-payment`, 
  AuthenticatedHotelAdminMiddleware, 
  bookingController.getApprovedPayment
)

router.get(
  `${pathPayment}/get/pending-payment`, 
  AuthenticatedHotelAdminMiddleware, 
  bookingController.getPendingPayment
)


export default router;

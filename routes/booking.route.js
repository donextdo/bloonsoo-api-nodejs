import { Router } from "express";

import {
  AuthenticatedMiddleware,
  AuthenticatedAdminMiddleware,
  AuthenticatedHotelAdminMiddleware,
} from "../middleware/authenticated.js";

import bookingController from '../controllers/booking.js'

const router = Router();

const path = '/booking'

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

export default router;

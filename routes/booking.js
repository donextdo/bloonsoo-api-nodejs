import { Router } from "express";

import {
  AuthenticatedMiddleware,
  AuthenticatedAdminMiddleware,
  AuthenticatedHotelAdminMiddleware,
} from "../middleware/authenticated.js";

import bookingController from '../controllers/booking.js'

const router = Router();

router.post("/", AuthenticatedMiddleware, bookingController.addBooking);

router.get("/", AuthenticatedHotelAdminMiddleware, bookingController.getAllBookings)

router.get("/my/bookings", AuthenticatedMiddleware, bookingController.getMyBookings)

router.get('/:id', AuthenticatedMiddleware, bookingController.getBookingById)

export default router;

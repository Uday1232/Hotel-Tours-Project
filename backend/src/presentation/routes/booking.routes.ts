import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/authorize'
import { validate } from '../middleware/validate'
import {
  createRoomBookingSchema,
  checkAvailabilitySchema,
  bookingFilterSchema
} from '../validators/booking.validator'
import {
  checkAvailability,
  createBooking,
  getBookingById,
  getBookingByNumber,
  getAllBookings,
  getCustomerBookings,
  cancelBooking,
  checkIn,
  checkOut
} from '../controllers/booking.controller'

const router = Router()

// Availability check - public
router.get('/availability', validate(checkAvailabilitySchema, 'query'), checkAvailability)

// Bookings - admin management
router.get('/', authenticate, authorize('ADMIN'), validate(bookingFilterSchema, 'query'), getAllBookings)
router.get('/customer/:customerId', authenticate, getCustomerBookings)
router.get('/number/:bookingNumber', authenticate, getBookingByNumber)
router.get('/:id', authenticate, getBookingById)

// Create booking - authenticated users
router.post('/', authenticate, validate(createRoomBookingSchema), createBooking)

// Cancel booking
router.put('/:id/cancel', authenticate, cancelBooking)

// Check-in / Check-out - admin only
router.put('/:id/check-in', authenticate, authorize('ADMIN'), checkIn)
router.put('/:id/check-out', authenticate, authorize('ADMIN'), checkOut)

export default router
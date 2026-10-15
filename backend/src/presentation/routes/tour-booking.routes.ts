import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/authorize'
import { validate } from '../middleware/validate'
import {
  createTourBookingSchema,
  tourBookingFilterSchema
} from '../validators/tour-booking.validator'
import {
  createTourBooking,
  getTourBookingById,
  getAllTourBookings,
  getCustomerTourBookings,
  cancelTourBooking,
  confirmTourBooking,
  completeTourBooking
} from '../controllers/tour-booking.controller'

const router = Router()

// Tour Bookings - admin management
router.get('/', authenticate, authorize('ADMIN'), validate(tourBookingFilterSchema, 'query'), getAllTourBookings)
router.get('/customer/:customerId', authenticate, getCustomerTourBookings)
router.get('/:id', authenticate, getTourBookingById)

// Create tour booking - authenticated users
router.post('/', authenticate, validate(createTourBookingSchema), createTourBooking)

// Cancel tour booking
router.put('/:id/cancel', authenticate, cancelTourBooking)

// Status management - admin only
router.put('/:id/confirm', authenticate, authorize('ADMIN'), confirmTourBooking)
router.put('/:id/complete', authenticate, authorize('ADMIN'), completeTourBooking)

export default router
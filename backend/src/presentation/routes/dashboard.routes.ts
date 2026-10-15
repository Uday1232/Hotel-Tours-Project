import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/authorize'
import {
  getOverview,
  getBookingSummary,
  getRevenueByMonth,
  getOccupancyRate,
  getRecentBookings,
  getTopTours,
  getBookingCalendar
} from '../controllers/dashboard.controller'

const router = Router()

router.get('/overview', authenticate, authorize('ADMIN'), getOverview)
router.get('/booking-summary', authenticate, authorize('ADMIN'), getBookingSummary)
router.get('/revenue', authenticate, authorize('ADMIN'), getRevenueByMonth)
router.get('/occupancy', authenticate, authorize('ADMIN'), getOccupancyRate)
router.get('/recent-bookings', authenticate, authorize('ADMIN'), getRecentBookings)
router.get('/top-tours', authenticate, authorize('ADMIN'), getTopTours)
router.get('/calendar', authenticate, authorize('ADMIN'), getBookingCalendar)

export default router
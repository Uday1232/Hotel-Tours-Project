import { Router } from 'express'
import authRoutes from './auth.routes'
import hotelRoutes from './hotel.routes'
import tourRoutes from './tour.routes'
import bookingRoutes from './booking.routes'
import tourBookingRoutes from './tour-booking.routes'
import dashboardRoutes from './dashboard.routes'
import placesRoutes from './places.routes'
import adminUserRoutes from './admin-user.routes'
import adminBookingRoutes from './admin-booking.routes'
import uploadRoutes from './upload.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/hotel', hotelRoutes)
router.use('/tours', tourRoutes)
router.use('/bookings', bookingRoutes)
router.use('/tour-bookings', tourBookingRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/places', placesRoutes)
router.use('/admin/users', adminUserRoutes)
router.use('/admin/bookings', adminBookingRoutes)
router.use('/upload', uploadRoutes)

export default router
import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/authorize'
import { createOfflineRoomBooking, createOfflineTourBooking } from '../controllers/admin-booking.controller'

const router = Router()

router.use(authenticate)
router.use(authorize('ADMIN'))

router.post('/rooms', createOfflineRoomBooking)
router.post('/tours', createOfflineTourBooking)

export default router
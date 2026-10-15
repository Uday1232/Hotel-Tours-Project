import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/authorize'
import { validate } from '../middleware/validate'
import {
  createTourSchema, updateTourSchema,
  createItinerarySchema, updateItinerarySchema,
  createTourImageSchema
} from '../validators/tour.validator'
import {
  createTour, getTours, getTourById, updateTour, deleteTour,
  getFeaturedTours, getToursByCategory,
  addItineraryDay, getItineraryByTourId, updateItineraryDay, deleteItineraryDay, reorderItinerary,
  addTourImage, getTourImages, deleteTourImage, setPrimaryTourImage, reorderTourImages
} from '../controllers/tour.controller'

const router = Router()

// Tour Packages - public read, admin write
router.get('/tours/featured', getFeaturedTours)
router.get('/tours/category/:category', getToursByCategory)
router.get('/tours', getTours)
router.get('/tours/:id', getTourById)
router.post('/tours', authenticate, authorize('ADMIN'), validate(createTourSchema), createTour)
router.put('/tours/:id', authenticate, authorize('ADMIN'), validate(updateTourSchema), updateTour)
router.delete('/tours/:id', authenticate, authorize('ADMIN'), deleteTour)

// Itinerary - admin only
router.get('/tours/:tourId/itinerary', getItineraryByTourId)
router.post('/tours/:tourId/itinerary', authenticate, authorize('ADMIN'), validate(createItinerarySchema), addItineraryDay)
router.put('/tours/:tourId/itinerary/reorder', authenticate, authorize('ADMIN'), reorderItinerary)
router.put('/itinerary/:id', authenticate, authorize('ADMIN'), validate(updateItinerarySchema), updateItineraryDay)
router.delete('/itinerary/:id', authenticate, authorize('ADMIN'), deleteItineraryDay)

// Tour Images - admin only
router.get('/tours/:tourId/images', getTourImages)
router.post('/tours/:tourId/images', authenticate, authorize('ADMIN'), validate(createTourImageSchema), addTourImage)
router.put('/tours/:tourId/images/reorder', authenticate, authorize('ADMIN'), reorderTourImages)
router.put('/tour-images/:id/primary', authenticate, authorize('ADMIN'), setPrimaryTourImage)
router.delete('/tour-images/:id', authenticate, authorize('ADMIN'), deleteTourImage)

export default router
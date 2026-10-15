import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { authorize } from '../middleware/authorize'
import { validate } from '../middleware/validate'
import {
  createRoomTypeSchema, updateRoomTypeSchema,
  createRoomSchema, updateRoomSchema,
  createRoomImageSchema,
  createAmenitySchema, updateAmenitySchema
} from '../validators/hotel.validator'
import {
  createRoomType, getRoomTypes, getRoomTypeById, updateRoomType, deleteRoomType,
  createRoom, getRooms, getRoomById, updateRoom, deleteRoom,
  addRoomImage, getRoomImages, deleteRoomImage, setPrimaryImage, reorderImages,
  createAmenity, getAmenities, getAmenitiesByCategory, updateAmenity, deleteAmenity,
  assignAmenitiesToRoom, getRoomAmenities
} from '../controllers/hotel.controller'

const router = Router()

// Room Types - public read, admin write
router.get('/room-types', getRoomTypes)
router.get('/room-types/:id', getRoomTypeById)
router.post('/room-types', authenticate, authorize('ADMIN'), validate(createRoomTypeSchema), createRoomType)
router.put('/room-types/:id', authenticate, authorize('ADMIN'), validate(updateRoomTypeSchema), updateRoomType)
router.delete('/room-types/:id', authenticate, authorize('ADMIN'), deleteRoomType)

// Rooms - public read, admin write
router.get('/rooms', getRooms)
router.get('/rooms/:id', getRoomById)
router.post('/rooms', authenticate, authorize('ADMIN'), validate(createRoomSchema), createRoom)
router.put('/rooms/:id', authenticate, authorize('ADMIN'), validate(updateRoomSchema), updateRoom)
router.delete('/rooms/:id', authenticate, authorize('ADMIN'), deleteRoom)

// Room Images - admin only
router.get('/rooms/:roomId/images', getRoomImages)
router.post('/rooms/:roomId/images', authenticate, authorize('ADMIN'), validate(createRoomImageSchema), addRoomImage)
router.put('/rooms/:roomId/images/reorder', authenticate, authorize('ADMIN'), reorderImages)
router.put('/images/:id/primary', authenticate, authorize('ADMIN'), setPrimaryImage)
router.delete('/images/:id', authenticate, authorize('ADMIN'), deleteRoomImage)

// Amenities - public read, admin write
router.get('/amenities', getAmenities)
router.get('/amenities/category/:category', getAmenitiesByCategory)
router.post('/amenities', authenticate, authorize('ADMIN'), validate(createAmenitySchema), createAmenity)
router.put('/amenities/:id', authenticate, authorize('ADMIN'), validate(updateAmenitySchema), updateAmenity)
router.delete('/amenities/:id', authenticate, authorize('ADMIN'), deleteAmenity)

// Room Amenities
router.get('/rooms/:roomId/amenities', getRoomAmenities)
router.put('/rooms/:roomId/amenities', authenticate, authorize('ADMIN'), assignAmenitiesToRoom)

export default router
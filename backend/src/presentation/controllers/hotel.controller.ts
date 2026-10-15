import { Request, Response, NextFunction } from 'express'
import { RoomTypeUseCase } from '../../application/use-cases/hotel/room-type'
import { RoomUseCase } from '../../application/use-cases/hotel/room'
import { RoomImageUseCase } from '../../application/use-cases/hotel/room-image'
import { AmenityUseCase } from '../../application/use-cases/hotel/amenity'

const roomTypeUseCase = new RoomTypeUseCase()
const roomUseCase = new RoomUseCase()
const roomImageUseCase = new RoomImageUseCase()
const amenityUseCase = new AmenityUseCase()

type IdParam = { id: string }
type RoomIdParam = { roomId: string }

// Room Type handlers
export async function createRoomType(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await roomTypeUseCase.create(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getRoomTypes(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await roomTypeUseCase.getAll()
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getRoomTypeById(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await roomTypeUseCase.getById(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function updateRoomType(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await roomTypeUseCase.update(req.params.id, req.body)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function deleteRoomType(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    await roomTypeUseCase.delete(req.params.id)
    res.status(204).send()
  } catch (error) { next(error) }
}

// Room handlers
export async function createRoom(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await roomUseCase.create(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getRooms(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await roomUseCase.getAll(req.query as any)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getRoomById(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await roomUseCase.getById(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function updateRoom(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await roomUseCase.update(req.params.id, req.body)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function deleteRoom(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    await roomUseCase.delete(req.params.id)
    res.status(204).send()
  } catch (error) { next(error) }
}

// Room Image handlers
export async function addRoomImage(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await roomImageUseCase.addImage(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getRoomImages(req: Request<RoomIdParam>, res: Response, next: NextFunction) {
  try {
    const result = await roomImageUseCase.getByRoomId(req.params.roomId)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function deleteRoomImage(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    await roomImageUseCase.delete(req.params.id)
    res.status(204).send()
  } catch (error) { next(error) }
}

export async function setPrimaryImage(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await roomImageUseCase.setPrimary(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function reorderImages(req: Request<RoomIdParam>, res: Response, next: NextFunction) {
  try {
    const result = await roomImageUseCase.reorder(req.params.roomId, req.body.imageIds)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

// Amenity handlers
export async function createAmenity(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await amenityUseCase.create(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getAmenities(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await amenityUseCase.getAll()
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getAmenitiesByCategory(req: Request<{ category: string }>, res: Response, next: NextFunction) {
  try {
    const result = await amenityUseCase.getByCategory(req.params.category)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function updateAmenity(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await amenityUseCase.update(req.params.id, req.body)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function deleteAmenity(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    await amenityUseCase.delete(req.params.id)
    res.status(204).send()
  } catch (error) { next(error) }
}

export async function assignAmenitiesToRoom(req: Request<RoomIdParam>, res: Response, next: NextFunction) {
  try {
    const result = await amenityUseCase.assignToRoom(req.params.roomId, req.body.amenityIds)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getRoomAmenities(req: Request<RoomIdParam>, res: Response, next: NextFunction) {
  try {
    const result = await amenityUseCase.getByRoomId(req.params.roomId)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}
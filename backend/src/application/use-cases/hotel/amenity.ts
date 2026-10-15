import { prisma } from '../../../infrastructure/database/prisma-client'
import { CreateAmenityInput, UpdateAmenityInput } from '../../dto/hotel.dto'

export class AmenityUseCase {
  async create(input: CreateAmenityInput) {
    const existing = await prisma.amenity.findUnique({ where: { name: input.name } })
    if (existing) {
      throw new AppError('Amenity name already exists', 409)
    }
    return prisma.amenity.create({ data: input })
  }

  async getAll() {
    return prisma.amenity.findMany({
      orderBy: { name: 'asc' }
    })
  }

  async getByCategory(category: string) {
    return prisma.amenity.findMany({
      where: { category, isActive: true },
      orderBy: { name: 'asc' }
    })
  }

  async update(id: string, input: UpdateAmenityInput) {
    const existing = await prisma.amenity.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError('Amenity not found', 404)
    }
    return prisma.amenity.update({ where: { id }, data: input })
  }

  async delete(id: string) {
    const existing = await prisma.amenity.findUnique({
      where: { id },
      include: { rooms: true }
    })
    if (!existing) {
      throw new AppError('Amenity not found', 404)
    }
    if (existing.rooms.length > 0) {
      throw new AppError('Cannot delete amenity assigned to rooms', 400)
    }
    return prisma.amenity.delete({ where: { id } })
  }

  async assignToRoom(roomId: string, amenityIds: string[]) {
    const room = await prisma.room.findUnique({ where: { id: roomId } })
    if (!room) {
      throw new AppError('Room not found', 404)
    }

    await prisma.roomAmenity.deleteMany({ where: { roomId } })

    const data = amenityIds.map((amenityId) => ({
      roomId,
      amenityId
    }))

    await prisma.roomAmenity.createMany({ data })

    return prisma.roomAmenity.findMany({
      where: { roomId },
      include: { amenity: true }
    })
  }

  async getByRoomId(roomId: string) {
    return prisma.roomAmenity.findMany({
      where: { roomId },
      include: { amenity: true }
    })
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
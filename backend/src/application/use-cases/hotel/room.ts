import { prisma } from '../../../infrastructure/database/prisma-client'
import { CreateRoomInput, UpdateRoomInput, RoomFilterInput } from '../../dto/hotel.dto'

export class RoomUseCase {
  async create(input: CreateRoomInput) {
    const roomType = await prisma.roomType.findUnique({ where: { id: input.roomTypeId } })
    if (!roomType) {
      throw new AppError('Room type not found', 404)
    }

    const existing = await prisma.room.findUnique({ where: { number: input.number } })
    if (existing) {
      throw new AppError('Room number already exists', 409)
    }

    return prisma.room.create({
      data: input,
      include: { roomType: true, images: true, amenities: { include: { amenity: true } } }
    })
  }

  async getById(id: string) {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        roomType: true,
        images: { orderBy: { sortOrder: 'asc' } },
        amenities: { include: { amenity: true } }
      }
    })
    if (!room) {
      throw new AppError('Room not found', 404)
    }
    return room
  }

  async getAll(filters: RoomFilterInput) {
    const page = Number(filters.page) || 1
    const limit = Number(filters.limit) || 20
    const { page: _, limit: __, ...where } = filters
    const skip = (page - 1) * limit

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where: {
          ...(where.roomTypeId && { roomTypeId: where.roomTypeId }),
          ...(where.floor && { floor: Number(where.floor) }),
          ...(where.status && { status: where.status as any }),
          ...(where.isActive !== undefined && { isActive: where.isActive }),
          ...(where.minPrice && { roomType: { basePrice: { gte: Number(where.minPrice) } } }),
          ...(where.maxPrice && { roomType: { basePrice: { lte: Number(where.maxPrice) } } }),
          ...(where.maxGuests && { roomType: { maxGuests: { gte: Number(where.maxGuests) } } })
        },
        include: {
          roomType: true,
          images: { where: { isPrimary: true }, take: 1 }
        },
        skip,
        take: limit,
        orderBy: { number: 'asc' }
      }),
      prisma.room.count()
    ])

    return {
      rooms,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async update(id: string, input: UpdateRoomInput) {
    const existing = await prisma.room.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError('Room not found', 404)
    }

    if (input.number && input.number !== existing.number) {
      const duplicate = await prisma.room.findUnique({ where: { number: input.number } })
      if (duplicate) {
        throw new AppError('Room number already exists', 409)
      }
    }

    return prisma.room.update({
      where: { id },
      data: {
        ...(input.roomTypeId && { roomTypeId: input.roomTypeId }),
        ...(input.number && { number: input.number }),
        ...(input.floor && { floor: input.floor }),
        ...(input.status && { status: input.status as any }),
        ...(input.isActive !== undefined && { isActive: input.isActive })
      },
      include: { roomType: true, images: true, amenities: { include: { amenity: true } } }
    })
  }

  async delete(id: string) {
    const existing = await prisma.room.findUnique({
      where: { id },
      include: { bookings: true }
    })
    if (!existing) {
      throw new AppError('Room not found', 404)
    }
    if (existing.bookings.length > 0) {
      throw new AppError('Cannot delete room with existing bookings', 400)
    }
    return prisma.room.delete({ where: { id } })
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
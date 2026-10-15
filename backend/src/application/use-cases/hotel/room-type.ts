import { prisma } from '../../../infrastructure/database/prisma-client'
import { CreateRoomTypeInput, UpdateRoomTypeInput } from '../../dto/hotel.dto'

export class RoomTypeUseCase {
  async create(input: CreateRoomTypeInput) {
    const existing = await prisma.roomType.findUnique({ where: { name: input.name } })
    if (existing) {
      throw new AppError('Room type name already exists', 409)
    }
    return prisma.roomType.create({ data: input })
  }

  async getById(id: string) {
    const roomType = await prisma.roomType.findUnique({
      where: { id },
      include: { rooms: true }
    })
    if (!roomType) {
      throw new AppError('Room type not found', 404)
    }
    return roomType
  }

  async getAll() {
    return prisma.roomType.findMany({
      include: { _count: { select: { rooms: true } } },
      orderBy: { name: 'asc' }
    })
  }

  async update(id: string, input: UpdateRoomTypeInput) {
    const existing = await prisma.roomType.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError('Room type not found', 404)
    }
    return prisma.roomType.update({ where: { id }, data: input })
  }

  async delete(id: string) {
    const existing = await prisma.roomType.findUnique({
      where: { id },
      include: { rooms: true }
    })
    if (!existing) {
      throw new AppError('Room type not found', 404)
    }
    if (existing.rooms.length > 0) {
      throw new AppError('Cannot delete room type with existing rooms', 400)
    }
    return prisma.roomType.delete({ where: { id } })
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
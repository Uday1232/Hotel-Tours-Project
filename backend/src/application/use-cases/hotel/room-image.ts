import { prisma } from '../../../infrastructure/database/prisma-client'
import { CreateRoomImageInput } from '../../dto/hotel.dto'

export class RoomImageUseCase {
  async addImage(input: CreateRoomImageInput) {
    const room = await prisma.room.findUnique({ where: { id: input.roomId } })
    if (!room) {
      throw new AppError('Room not found', 404)
    }

    if (input.isPrimary) {
      await prisma.roomImage.updateMany({
        where: { roomId: input.roomId, isPrimary: true },
        data: { isPrimary: false }
      })
    }

    return prisma.roomImage.create({ data: input })
  }

  async getByRoomId(roomId: string) {
    return prisma.roomImage.findMany({
      where: { roomId },
      orderBy: { sortOrder: 'asc' }
    })
  }

  async delete(id: string) {
    const existing = await prisma.roomImage.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError('Image not found', 404)
    }
    return prisma.roomImage.delete({ where: { id } })
  }

  async setPrimary(id: string) {
    const image = await prisma.roomImage.findUnique({ where: { id } })
    if (!image) {
      throw new AppError('Image not found', 404)
    }

    await prisma.roomImage.updateMany({
      where: { roomId: image.roomId, isPrimary: true },
      data: { isPrimary: false }
    })

    return prisma.roomImage.update({
      where: { id },
      data: { isPrimary: true }
    })
  }

  async reorder(roomId: string, imageIds: string[]) {
    for (let i = 0; i < imageIds.length; i++) {
      await prisma.roomImage.update({
        where: { id: imageIds[i] },
        data: { sortOrder: i }
      })
    }
    return prisma.roomImage.findMany({
      where: { roomId },
      orderBy: { sortOrder: 'asc' }
    })
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
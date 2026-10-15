import { prisma } from '../../../infrastructure/database/prisma-client'
import { CreateTourImageInput } from '../../dto/tour.dto'

export class TourImageUseCase {
  async addImage(input: CreateTourImageInput) {
    const tour = await prisma.tourPackage.findUnique({ where: { id: input.tourId } })
    if (!tour) {
      throw new AppError('Tour package not found', 404)
    }

    if (input.isPrimary) {
      await prisma.tourImage.updateMany({
        where: { tourId: input.tourId, isPrimary: true },
        data: { isPrimary: false }
      })
    }

    return prisma.tourImage.create({ data: input })
  }

  async getByTourId(tourId: string) {
    return prisma.tourImage.findMany({
      where: { tourId },
      orderBy: { sortOrder: 'asc' }
    })
  }

  async delete(id: string) {
    const existing = await prisma.tourImage.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError('Image not found', 404)
    }
    return prisma.tourImage.delete({ where: { id } })
  }

  async setPrimary(id: string) {
    const image = await prisma.tourImage.findUnique({ where: { id } })
    if (!image) {
      throw new AppError('Image not found', 404)
    }

    await prisma.tourImage.updateMany({
      where: { tourId: image.tourId, isPrimary: true },
      data: { isPrimary: false }
    })

    return prisma.tourImage.update({
      where: { id },
      data: { isPrimary: true }
    })
  }

  async reorder(tourId: string, imageIds: string[]) {
    for (let i = 0; i < imageIds.length; i++) {
      await prisma.tourImage.update({
        where: { id: imageIds[i] },
        data: { sortOrder: i }
      })
    }
    return prisma.tourImage.findMany({
      where: { tourId },
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
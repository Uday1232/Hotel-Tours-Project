import { prisma } from '../../../infrastructure/database/prisma-client'
import { CreateItineraryInput, UpdateItineraryInput } from '../../dto/tour.dto'

export class TourItineraryUseCase {
  async addDay(input: CreateItineraryInput) {
    const tour = await prisma.tourPackage.findUnique({ where: { id: input.tourId } })
    if (!tour) {
      throw new AppError('Tour package not found', 404)
    }

    const existing = await prisma.tourItinerary.findUnique({
      where: { tourId_dayNumber: { tourId: input.tourId, dayNumber: input.dayNumber } }
    })
    if (existing) {
      throw new AppError('Day number already exists for this tour', 409)
    }

    return prisma.tourItinerary.create({ data: input })
  }

  async getByTourId(tourId: string) {
    const tour = await prisma.tourPackage.findUnique({ where: { id: tourId } })
    if (!tour) {
      throw new AppError('Tour package not found', 404)
    }

    return prisma.tourItinerary.findMany({
      where: { tourId },
      orderBy: { dayNumber: 'asc' }
    })
  }

  async getById(id: string) {
    const itinerary = await prisma.tourItinerary.findUnique({ where: { id } })
    if (!itinerary) {
      throw new AppError('Itinerary not found', 404)
    }
    return itinerary
  }

  async update(id: string, input: UpdateItineraryInput) {
    const existing = await prisma.tourItinerary.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError('Itinerary not found', 404)
    }

    if (input.dayNumber && input.dayNumber !== existing.dayNumber) {
      const duplicate = await prisma.tourItinerary.findUnique({
        where: { tourId_dayNumber: { tourId: existing.tourId, dayNumber: input.dayNumber } }
      })
      if (duplicate) {
        throw new AppError('Day number already exists for this tour', 409)
      }
    }

    return prisma.tourItinerary.update({ where: { id }, data: input })
  }

  async delete(id: string) {
    const existing = await prisma.tourItinerary.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError('Itinerary not found', 404)
    }
    return prisma.tourItinerary.delete({ where: { id } })
  }

  async reorder(tourId: string, dayIds: string[]) {
    for (let i = 0; i < dayIds.length; i++) {
      const dayNumber = i + 1
      await prisma.tourItinerary.update({
        where: { id: dayIds[i] },
        data: { dayNumber }
      })
    }
    return prisma.tourItinerary.findMany({
      where: { tourId },
      orderBy: { dayNumber: 'asc' }
    })
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
import { prisma } from '../../../infrastructure/database/prisma-client'
import { TourCategory } from '@prisma/client'
import { CreateTourInput, UpdateTourInput, TourFilterInput } from '../../dto/tour.dto'

export class TourPackageUseCase {
  async create(input: CreateTourInput) {
    return prisma.tourPackage.create({
      data: {
        ...input,
        category: input.category as TourCategory
      },
      include: { itinerary: { orderBy: { dayNumber: 'asc' } }, images: true }
    })
  }

  async getById(id: string) {
    const tour = await prisma.tourPackage.findUnique({
      where: { id },
      include: {
        itinerary: { orderBy: { dayNumber: 'asc' } },
        images: { orderBy: { sortOrder: 'asc' } }
      }
    })
    if (!tour) {
      throw new AppError('Tour package not found', 404)
    }
    return tour
  }

  async getAll(filters: TourFilterInput) {
    const page = Number(filters.page) || 1
    const limit = Number(filters.limit) || 20
    const { page: _, limit: __, ...where } = filters
    const skip = (page - 1) * limit

    const [tours, total] = await Promise.all([
      prisma.tourPackage.findMany({
        where: {
          ...(where.category && { category: where.category as any }),
          ...(where.isFeatured !== undefined && { isFeatured: where.isFeatured }),
          ...(where.isActive !== undefined && { isActive: where.isActive }),
          ...(where.minPrice && { price: { gte: where.minPrice } }),
          ...(where.maxPrice && { price: { lte: where.maxPrice } }),
          ...(where.minDuration && { durationDays: { gte: where.minDuration } }),
          ...(where.maxDuration && { durationDays: { lte: where.maxDuration } })
        },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          _count: { select: { itinerary: true, bookings: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.tourPackage.count()
    ])

    return {
      tours,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async update(id: string, input: UpdateTourInput) {
    const existing = await prisma.tourPackage.findUnique({ where: { id } })
    if (!existing) {
      throw new AppError('Tour package not found', 404)
    }
    const { category, ...rest } = input
    return prisma.tourPackage.update({
      where: { id },
      data: {
        ...rest,
        ...(category && { category: category as TourCategory })
      },
      include: { itinerary: { orderBy: { dayNumber: 'asc' } }, images: true }
    })
  }

  async delete(id: string) {
    const existing = await prisma.tourPackage.findUnique({
      where: { id },
      include: { bookings: true }
    })
    if (!existing) {
      throw new AppError('Tour package not found', 404)
    }
    if (existing.bookings.length > 0) {
      throw new AppError('Cannot delete tour with existing bookings', 400)
    }
    return prisma.tourPackage.delete({ where: { id } })
  }

  async getFeatured() {
    return prisma.tourPackage.findMany({
      where: { isFeatured: true, isActive: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        _count: { select: { itinerary: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async getByCategory(category: string) {
    return prisma.tourPackage.findMany({
      where: { category: category as any, isActive: true },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        _count: { select: { itinerary: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
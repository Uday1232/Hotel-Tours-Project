import { prisma } from '../../../infrastructure/database/prisma-client'
import { CreateTourBookingInput, TourBookingFilterInput } from '../../dto/tour-booking.dto'

function generateBookingNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `TB-${year}-${random}`
}

export class TourBookingUseCase {
  async createBooking(input: CreateTourBookingInput) {
    const tour = await prisma.tourPackage.findUnique({ where: { id: input.tourId } })
    if (!tour) {
      throw new AppError('Tour package not found', 404)
    }

    if (!tour.isActive) {
      throw new AppError('Tour package is not active', 400)
    }

    const travelDate = new Date(input.travelDate)

    const existingBookings = await prisma.bookingTour.findMany({
      where: {
        tourId: input.tourId,
        travelDate: travelDate,
        booking: { status: { in: ['PENDING', 'CONFIRMED'] } }
      }
    })

    const totalBooked = existingBookings.reduce((sum, b) => sum + b.numberOfPeople, 0)

    if (totalBooked + input.numberOfPeople > tour.maxGroupSize) {
      throw new AppError(`Only ${tour.maxGroupSize - totalBooked} spots available`, 409)
    }

    const pricePerPerson = Number(tour.price)
    const totalPrice = pricePerPerson * input.numberOfPeople

    const booking = await prisma.booking.create({
      data: {
        customerId: input.customerId,
        bookingNumber: generateBookingNumber(),
        status: 'PENDING',
        totalAmount: totalPrice,
        notes: input.notes,
        tours: {
          create: {
            tourId: input.tourId,
            travelDate,
            numberOfPeople: input.numberOfPeople,
            pricePerPerson,
            totalPrice
          }
        }
      },
      include: {
        tours: {
          include: { tour: { select: { name: true, durationDays: true, durationNights: true } } }
        }
      }
    })

    return {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      totalAmount: booking.totalAmount,
      tourName: tour.name,
      travelDate,
      numberOfPeople: input.numberOfPeople,
      pricePerPerson,
      createdAt: booking.createdAt
    }
  }

  async getBookingById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        tours: {
          include: { tour: true }
        },
        payment: true,
        customer: { select: { id: true, name: true, email: true, phone: true } }
      }
    })
    if (!booking) {
      throw new AppError('Booking not found', 404)
    }
    return booking
  }

  async getAllBookings(filters: TourBookingFilterInput) {
    const page = Number(filters.page) || 1
    const limit = Number(filters.limit) || 20
    const { page: _, limit: __, ...where } = filters
    const skip = (page - 1) * limit

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: {
          ...(where.customerId && { customerId: where.customerId }),
          ...(where.status && { status: where.status as any }),
          ...(where.tourId && { tours: { some: { tourId: where.tourId } } }),
          ...(where.fromDate && { createdAt: { gte: new Date(where.fromDate) } }),
          ...(where.toDate && { createdAt: { lte: new Date(where.toDate) } })
        },
        include: {
          tours: {
            include: { tour: { select: { name: true, category: true } } }
          },
          customer: { select: { name: true, email: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.booking.count()
    ])

    return {
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async getCustomerBookings(customerId: string) {
    return prisma.booking.findMany({
      where: { customerId },
      include: {
        tours: {
          include: { tour: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async cancelBooking(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { tours: true }
    })
    if (!booking) {
      throw new AppError('Booking not found', 404)
    }

    if (booking.status === 'COMPLETED') {
      throw new AppError('Cannot cancel completed booking', 400)
    }

    if (booking.status === 'CANCELLED') {
      throw new AppError('Booking already cancelled', 400)
    }

    for (const tourBooking of booking.tours) {
      if (new Date(tourBooking.travelDate) <= new Date()) {
        throw new AppError('Cannot cancel booking for past travel dates', 400)
      }
    }

    return prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' }
    })
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
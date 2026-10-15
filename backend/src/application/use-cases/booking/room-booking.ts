import { prisma } from '../../../infrastructure/database/prisma-client'
import { CreateRoomBookingInput, BookingFilterInput, CheckAvailabilityInput, AvailabilityResult } from '../../dto/booking.dto'

function generateBookingNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `BK-${year}-${random}`
}

function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export class RoomBookingUseCase {
  async checkAvailability(input: CheckAvailabilityInput): Promise<AvailabilityResult> {
    const checkIn = new Date(input.checkIn)
    const checkOut = new Date(input.checkOut)

    const room = await prisma.room.findUnique({ where: { id: input.roomId } })
    if (!room) {
      throw new AppError('Room not found', 404)
    }

    const conflictingBooking = await prisma.bookingRoom.findFirst({
      where: {
        roomId: input.roomId,
        booking: {
          status: { in: ['PENDING', 'CONFIRMED'] }
        },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } }
        ]
      },
      include: { booking: { select: { id: true, bookingNumber: true } } }
    })

    return {
      roomId: input.roomId,
      available: !conflictingBooking,
      checkIn,
      checkOut,
      conflictingBookingId: conflictingBooking?.booking.bookingNumber
    }
  }

  async createBooking(input: CreateRoomBookingInput) {
    const checkIn = new Date(input.checkIn)
    const checkOut = new Date(input.checkOut)

    const room = await prisma.room.findUnique({
      where: { id: input.roomId },
      include: { roomType: true }
    })
    if (!room) {
      throw new AppError('Room not found', 404)
    }

    if (room.status === 'MAINTENANCE') {
      throw new AppError('Room is under maintenance', 400)
    }

    const conflictingBooking = await prisma.bookingRoom.findFirst({
      where: {
        roomId: input.roomId,
        booking: {
          status: { in: ['PENDING', 'CONFIRMED'] }
        },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } }
        ]
      }
    })

    if (conflictingBooking) {
      throw new AppError('Room is not available for selected dates', 409)
    }

    const totalNights = calculateNights(checkIn, checkOut)
    const pricePerNight = Number(room.roomType.basePrice)
    const totalPrice = pricePerNight * totalNights

    const booking = await prisma.booking.create({
      data: {
        customerId: input.customerId,
        bookingNumber: generateBookingNumber(),
        status: 'PENDING',
        totalAmount: totalPrice,
        notes: input.notes,
        rooms: {
          create: {
            roomId: input.roomId,
            checkIn,
            checkOut,
            pricePerNight,
            totalNights,
            totalPrice
          }
        }
      },
      include: {
        rooms: {
          include: { room: true }
        }
      }
    })

    return {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      totalAmount: booking.totalAmount,
      roomId: input.roomId,
      roomNumber: room.number,
      checkIn,
      checkOut,
      totalNights,
      createdAt: booking.createdAt
    }
  }

  async getBookingById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        rooms: {
          include: { room: { include: { roomType: true } } }
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

  async getBookingByNumber(bookingNumber: string) {
    const booking = await prisma.booking.findUnique({
      where: { bookingNumber },
      include: {
        rooms: {
          include: { room: { include: { roomType: true } } }
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

  async getAllBookings(filters: BookingFilterInput) {
    const page = Number(filters.page) || 1
    const limit = Number(filters.limit) || 20
    const { page: _, limit: __, ...where } = filters
    const skip = (page - 1) * limit

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: {
          ...(where.customerId && { customerId: where.customerId }),
          ...(where.status && { status: where.status as any }),
          ...(where.roomId && { rooms: { some: { roomId: where.roomId } } }),
          ...(where.fromDate && { createdAt: { gte: new Date(where.fromDate) } }),
          ...(where.toDate && { createdAt: { lte: new Date(where.toDate) } })
        },
        include: {
          rooms: {
            include: { room: { select: { number: true, floor: true } } }
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
        rooms: {
          include: { room: { include: { roomType: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  async cancelBooking(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { payment: true }
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

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: { rooms: true }
    })

    for (const room of updated.rooms) {
      await prisma.room.update({
        where: { id: room.roomId },
        data: { status: 'AVAILABLE' }
      })
    }

    return updated
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
import { prisma } from '../../../infrastructure/database/prisma-client'

export class BookingStatusUseCase {
  async checkIn(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { rooms: true }
    })

    if (!booking) {
      throw new AppError('Booking not found', 404)
    }

    if (booking.status !== 'CONFIRMED' && booking.status !== 'PENDING') {
      throw new AppError('Only pending or confirmed bookings can be checked in', 400)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const hasValidCheckIn = booking.rooms.some(
      (r) => {
        const checkInDate = new Date(r.checkIn)
        checkInDate.setHours(0, 0, 0, 0)
        return checkInDate <= today
      }
    )

    if (!hasValidCheckIn) {
      throw new AppError('Check-in date has not arrived yet', 400)
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: { rooms: true }
    })

    for (const room of updated.rooms) {
      await prisma.room.update({
        where: { id: room.roomId },
        data: { status: 'OCCUPIED' }
      })
    }

    return updated
  }

  async checkOut(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { rooms: true }
    })

    if (!booking) {
      throw new AppError('Booking not found', 404)
    }

    if (booking.status !== 'CONFIRMED') {
      throw new AppError('Only confirmed bookings can be checked out', 400)
    }

    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const hasPastCheckOut = booking.rooms.some(
      (r) => {
        const checkOutDate = new Date(r.checkOut)
        checkOutDate.setHours(23, 59, 59, 999)
        return checkOutDate <= today
      }
    )

    if (!hasPastCheckOut) {
      throw new AppError('Check-out date has not arrived yet', 400)
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED' },
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
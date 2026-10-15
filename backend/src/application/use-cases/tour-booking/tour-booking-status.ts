import { prisma } from '../../../infrastructure/database/prisma-client'

export class TourBookingStatusUseCase {
  async confirm(bookingId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) {
      throw new AppError('Booking not found', 404)
    }

    if (booking.status !== 'PENDING') {
      throw new AppError('Only pending bookings can be confirmed', 400)
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' }
    })
  }

  async complete(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { tours: true }
    })
    if (!booking) {
      throw new AppError('Booking not found', 404)
    }

    if (booking.status !== 'CONFIRMED') {
      throw new AppError('Only confirmed bookings can be completed', 400)
    }

    const lastTourDate = booking.tours.reduce((latest, t) => {
      const tourEnd = new Date(t.travelDate)
      tourEnd.setDate(tourEnd.getDate() + 1)
      return tourEnd > latest ? tourEnd : latest
    }, new Date(0))

    if (lastTourDate > new Date()) {
      throw new AppError('Tour has not ended yet', 400)
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED' }
    })
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
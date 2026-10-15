import { prisma } from '../../../infrastructure/database/prisma-client'
import bcrypt from 'bcryptjs'

function generateBookingNumber(type: 'BK' | 'TB'): string {
  const date = new Date()
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${type}-${year}-${random}`
}

function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export interface OfflineRoomBookingInput {
  customerName: string
  customerEmail: string
  customerPhone: string
  roomId: string
  checkIn: string
  checkOut: string
  notes?: string
  paymentMethod?: string
  paymentAmount?: number
}

export interface OfflineTourBookingInput {
  customerName: string
  customerEmail: string
  customerPhone: string
  tourId: string
  travelDate: string
  numberOfPeople: number
  notes?: string
  paymentMethod?: string
  paymentAmount?: number
}

export class AdminBookingUseCase {
  private async findOrCreateCustomer(name: string, email: string, phone: string) {
    let customer = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] }
    })

    if (!customer) {
      const tempPassword = await bcrypt.hash('Welcome@123', 12)
      customer = await prisma.user.create({
        data: {
          email,
          passwordHash: tempPassword,
          name,
          phone,
          role: 'CUSTOMER'
        }
      })
    }

    return customer
  }

  async createRoomBooking(input: OfflineRoomBookingInput) {
    const checkIn = new Date(input.checkIn)
    const checkOut = new Date(input.checkOut)

    if (checkOut <= checkIn) {
      throw new AppError('Check-out must be after check-in', 400)
    }

    const room = await prisma.room.findUnique({ where: { id: input.roomId } })
    if (!room) throw new AppError('Room not found', 404)
    if (room.status === 'MAINTENANCE') throw new AppError('Room is under maintenance', 400)

    const conflicting = await prisma.bookingRoom.findFirst({
      where: {
        roomId: input.roomId,
        booking: { status: { in: ['PENDING', 'CONFIRMED'] } },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } }
        ]
      }
    })
    if (conflicting) throw new AppError('Room is not available for selected dates', 409)

    const customer = await this.findOrCreateCustomer(input.customerName, input.customerEmail, input.customerPhone)
    const totalNights = calculateNights(checkIn, checkOut)
    const roomType = await prisma.roomType.findUnique({ where: { id: room.roomTypeId } })
    const pricePerNight = Number(roomType?.basePrice || 0)
    const totalPrice = pricePerNight * totalNights

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        bookingNumber: generateBookingNumber('BK'),
        status: input.paymentMethod ? 'CONFIRMED' : 'PENDING',
        totalAmount: totalPrice,
        notes: `Offline booking${input.notes ? ' - ' + input.notes : ''}`,
        rooms: {
          create: {
            roomId: input.roomId,
            checkIn,
            checkOut,
            pricePerNight,
            totalNights,
            totalPrice
          }
        },
        payment: input.paymentMethod ? {
          create: {
            amount: input.paymentAmount || totalPrice,
            method: input.paymentMethod as any,
            status: 'COMPLETED',
            paidAt: new Date()
          }
        } : undefined
      },
      include: {
        rooms: { include: { room: true } },
        customer: true,
        payment: true
      }
    })

    return {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      totalAmount: Number(booking.totalAmount),
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
      room: { number: room.number, roomType: roomType?.name },
      checkIn,
      checkOut,
      totalNights
    }
  }

  async createTourBooking(input: OfflineTourBookingInput) {
    const tour = await prisma.tourPackage.findUnique({ where: { id: input.tourId } })
    if (!tour) throw new AppError('Tour package not found', 404)
    if (!tour.isActive) throw new AppError('Tour package is not active', 400)

    const travelDate = new Date(input.travelDate)
    const existingBookings = await prisma.bookingTour.findMany({
      where: {
        tourId: input.tourId,
        travelDate,
        booking: { status: { in: ['PENDING', 'CONFIRMED'] } }
      }
    })
    const totalBooked = existingBookings.reduce((sum, b) => sum + b.numberOfPeople, 0)
    if (totalBooked + input.numberOfPeople > tour.maxGroupSize) {
      throw new AppError(`Only ${tour.maxGroupSize - totalBooked} spots available`, 409)
    }

    const customer = await this.findOrCreateCustomer(input.customerName, input.customerEmail, input.customerPhone)
    const pricePerPerson = Number(tour.price)
    const totalPrice = pricePerPerson * input.numberOfPeople

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        bookingNumber: generateBookingNumber('TB'),
        status: input.paymentMethod ? 'CONFIRMED' : 'PENDING',
        totalAmount: totalPrice,
        notes: `Offline booking${input.notes ? ' - ' + input.notes : ''}`,
        tours: {
          create: {
            tourId: input.tourId,
            travelDate,
            numberOfPeople: input.numberOfPeople,
            pricePerPerson,
            totalPrice
          }
        },
        payment: input.paymentMethod ? {
          create: {
            amount: input.paymentAmount || totalPrice,
            method: input.paymentMethod as any,
            status: 'COMPLETED',
            paidAt: new Date()
          }
        } : undefined
      },
      include: {
        tours: { include: { tour: true } },
        customer: true,
        payment: true
      }
    })

    return {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      totalAmount: Number(booking.totalAmount),
      customer: { name: customer.name, email: customer.email, phone: customer.phone },
      tour: { name: tour.name, category: tour.category },
      travelDate,
      numberOfPeople: input.numberOfPeople,
      pricePerPerson
    }
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
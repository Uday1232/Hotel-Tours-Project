import { Request, Response, NextFunction } from 'express'
import { AdminBookingUseCase } from '../../application/use-cases/admin/admin-booking'

const adminBookingUseCase = new AdminBookingUseCase()

export async function createOfflineRoomBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const { customerName, customerEmail, customerPhone, roomId, checkIn, checkOut, notes, paymentMethod, paymentAmount } = req.body

    if (!customerName || !customerEmail || !customerPhone || !roomId || !checkIn || !checkOut) {
      throw new AppError('Missing required fields: customerName, customerEmail, customerPhone, roomId, checkIn, checkOut', 400)
    }

    const result = await adminBookingUseCase.createRoomBooking({
      customerName, customerEmail, customerPhone, roomId, checkIn, checkOut, notes, paymentMethod, paymentAmount
    })
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function createOfflineTourBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const { customerName, customerEmail, customerPhone, tourId, travelDate, numberOfPeople, notes, paymentMethod, paymentAmount } = req.body

    if (!customerName || !customerEmail || !customerPhone || !tourId || !travelDate || !numberOfPeople) {
      throw new AppError('Missing required fields: customerName, customerEmail, customerPhone, tourId, travelDate, numberOfPeople', 400)
    }

    const result = await adminBookingUseCase.createTourBooking({
      customerName, customerEmail, customerPhone, tourId, travelDate, numberOfPeople, notes, paymentMethod, paymentAmount
    })
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
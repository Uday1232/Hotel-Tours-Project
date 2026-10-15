import { Request, Response, NextFunction } from 'express'
import { RoomBookingUseCase } from '../../application/use-cases/booking/room-booking'
import { BookingStatusUseCase } from '../../application/use-cases/booking/booking-status'

const roomBookingUseCase = new RoomBookingUseCase()
const bookingStatusUseCase = new BookingStatusUseCase()

type IdParam = { id: string }

export async function checkAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await roomBookingUseCase.checkAvailability(req.query as any)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function createBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await roomBookingUseCase.createBooking(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getBookingById(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await roomBookingUseCase.getBookingById(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getBookingByNumber(req: Request<{ bookingNumber: string }>, res: Response, next: NextFunction) {
  try {
    const result = await roomBookingUseCase.getBookingByNumber(req.params.bookingNumber)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getAllBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await roomBookingUseCase.getAllBookings(req.query as any)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getCustomerBookings(req: Request<{ customerId: string }>, res: Response, next: NextFunction) {
  try {
    const result = await roomBookingUseCase.getCustomerBookings(req.params.customerId)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function cancelBooking(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await roomBookingUseCase.cancelBooking(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function checkIn(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await bookingStatusUseCase.checkIn(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function checkOut(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await bookingStatusUseCase.checkOut(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}
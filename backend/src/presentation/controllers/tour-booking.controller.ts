import { Request, Response, NextFunction } from 'express'
import { TourBookingUseCase } from '../../application/use-cases/tour-booking/tour-booking'
import { TourBookingStatusUseCase } from '../../application/use-cases/tour-booking/tour-booking-status'

const tourBookingUseCase = new TourBookingUseCase()
const tourBookingStatusUseCase = new TourBookingStatusUseCase()

type IdParam = { id: string }

export async function createTourBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await tourBookingUseCase.createBooking(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getTourBookingById(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await tourBookingUseCase.getBookingById(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getAllTourBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await tourBookingUseCase.getAllBookings(req.query as any)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getCustomerTourBookings(req: Request<{ customerId: string }>, res: Response, next: NextFunction) {
  try {
    const result = await tourBookingUseCase.getCustomerBookings(req.params.customerId)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function cancelTourBooking(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await tourBookingUseCase.cancelBooking(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function confirmTourBooking(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await tourBookingStatusUseCase.confirm(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function completeTourBooking(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await tourBookingStatusUseCase.complete(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}
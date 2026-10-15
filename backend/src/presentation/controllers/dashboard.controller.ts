import { Request, Response, NextFunction } from 'express'
import { DashboardStatsUseCase } from '../../application/use-cases/dashboard/dashboard'

const dashboardUseCase = new DashboardStatsUseCase()

export async function getOverview(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await dashboardUseCase.getOverview()
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getBookingSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await dashboardUseCase.getBookingSummary()
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getRevenueByMonth(req: Request, res: Response, next: NextFunction) {
  try {
    const year = Number(req.query.year) || new Date().getFullYear()
    const result = await dashboardUseCase.getRevenueByMonth(year)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getOccupancyRate(req: Request, res: Response, next: NextFunction) {
  try {
    const days = Number(req.query.days) || 30
    const result = await dashboardUseCase.getOccupancyRate(days)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getRecentBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Number(req.query.limit) || 10
    const result = await dashboardUseCase.getRecentBookings(limit)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getTopTours(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = Number(req.query.limit) || 5
    const result = await dashboardUseCase.getTopTours(limit)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getBookingCalendar(req: Request, res: Response, next: NextFunction) {
  try {
    const startDate = (req.query.startDate as string) || new Date().toISOString().split('T')[0]
    const endDate = (req.query.endDate as string) || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const result = await dashboardUseCase.getBookingCalendar(startDate, endDate)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}
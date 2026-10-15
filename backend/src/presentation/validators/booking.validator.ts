import { z } from 'zod'

export const createRoomBookingSchema = z.object({
  roomId: z.string().uuid(),
  customerId: z.string().uuid(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  notes: z.string().max(500).optional()
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  { message: 'Check-out must be after check-in', path: ['checkOut'] }
)

export const checkAvailabilitySchema = z.object({
  roomId: z.string().uuid(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime()
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  { message: 'Check-out must be after check-in', path: ['checkOut'] }
)

export const bookingFilterSchema = z.object({
  customerId: z.string().uuid().optional(),
  roomId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'COMPLETED']).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
})

export const bookingIdSchema = z.object({
  id: z.string().uuid()
})
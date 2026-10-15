import { z } from 'zod'

export const createTourBookingSchema = z.object({
  tourId: z.string().uuid(),
  customerId: z.string().uuid(),
  travelDate: z.string().datetime(),
  numberOfPeople: z.number().int().positive().max(100),
  notes: z.string().max(500).optional()
}).refine(
  (data) => new Date(data.travelDate) > new Date(),
  { message: 'Travel date must be in the future', path: ['travelDate'] }
)

export const tourBookingFilterSchema = z.object({
  customerId: z.string().uuid().optional(),
  tourId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
})
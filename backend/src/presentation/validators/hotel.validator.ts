import { z } from 'zod'

export const createRoomTypeSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  basePrice: z.number().positive().max(100000),
  maxGuests: z.number().int().positive().max(10)
})

export const updateRoomTypeSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().min(10).max(500).optional(),
  basePrice: z.number().positive().max(100000).optional(),
  maxGuests: z.number().int().positive().max(10).optional(),
  isActive: z.boolean().optional()
})

export const createRoomSchema = z.object({
  roomTypeId: z.string().uuid(),
  number: z.string().min(1).max(10),
  floor: z.number().int().min(1).max(50)
})

export const updateRoomSchema = z.object({
  roomTypeId: z.string().uuid().optional(),
  number: z.string().min(1).max(10).optional(),
  floor: z.number().int().min(1).max(50).optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED']).optional(),
  isActive: z.boolean().optional()
})

export const createRoomImageSchema = z.object({
  roomId: z.string().uuid(),
  url: z.string().min(1),
  caption: z.string().max(200).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional()
})

export const createAmenitySchema = z.object({
  name: z.string().min(2).max(50),
  icon: z.string().max(50).optional(),
  category: z.string().max(50).optional()
})

export const updateAmenitySchema = z.object({
  name: z.string().min(2).max(50).optional(),
  icon: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
  isActive: z.boolean().optional()
})

export const roomFilterSchema = z.object({
  roomTypeId: z.string().uuid().optional(),
  floor: z.number().int().min(1).optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED']).optional(),
  isActive: z.boolean().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  maxGuests: z.number().int().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
})
import { z } from 'zod'

export const createTourSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  durationDays: z.number().int().positive().max(30),
  durationNights: z.number().int().min(0).max(29),
  price: z.number().positive().max(500000),
  category: z.enum(['ADVENTURE', 'CULTURAL', 'BEACH', 'PILGRIMAGE', 'WILDLIFE', 'HONEYMOON', 'FAMILY']),
  maxGroupSize: z.number().int().positive().max(100),
  isFeatured: z.boolean().optional()
})

export const updateTourSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(2000).optional(),
  durationDays: z.number().int().positive().max(30).optional(),
  durationNights: z.number().int().min(0).max(29).optional(),
  price: z.number().positive().max(500000).optional(),
  category: z.enum(['ADVENTURE', 'CULTURAL', 'BEACH', 'PILGRIMAGE', 'WILDLIFE', 'HONEYMOON', 'FAMILY']).optional(),
  maxGroupSize: z.number().int().positive().max(100).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional()
})

export const createItinerarySchema = z.object({
  tourId: z.string().uuid(),
  dayNumber: z.number().int().positive().max(30),
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  accommodation: z.string().max(200).optional(),
  meals: z.string().max(200).optional()
})

export const updateItinerarySchema = z.object({
  dayNumber: z.number().int().positive().max(30).optional(),
  title: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  accommodation: z.string().max(200).optional(),
  meals: z.string().max(200).optional()
})

export const createTourImageSchema = z.object({
  tourId: z.string().uuid(),
  url: z.string().min(1),
  caption: z.string().max(200).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional()
})

export const tourFilterSchema = z.object({
  category: z.enum(['ADVENTURE', 'CULTURAL', 'BEACH', 'PILGRIMAGE', 'WILDLIFE', 'HONEYMOON', 'FAMILY']).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minDuration: z.number().int().positive().optional(),
  maxDuration: z.number().int().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
})
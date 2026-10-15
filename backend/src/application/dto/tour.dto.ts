export interface CreateTourInput {
  name: string
  description: string
  durationDays: number
  durationNights: number
  price: number
  category: string
  maxGroupSize: number
  isFeatured?: boolean
}

export interface UpdateTourInput {
  name?: string
  description?: string
  durationDays?: number
  durationNights?: number
  price?: number
  category?: string
  maxGroupSize?: number
  isFeatured?: boolean
  isActive?: boolean
}

export interface CreateItineraryInput {
  tourId: string
  dayNumber: number
  title: string
  description: string
  accommodation?: string
  meals?: string
}

export interface UpdateItineraryInput {
  dayNumber?: number
  title?: string
  description?: string
  accommodation?: string
  meals?: string
}

export interface CreateTourImageInput {
  tourId: string
  url: string
  caption?: string
  sortOrder?: number
  isPrimary?: boolean
}

export interface TourFilterInput {
  category?: string
  isFeatured?: boolean
  isActive?: boolean
  minPrice?: number
  maxPrice?: number
  minDuration?: number
  maxDuration?: number
  page?: number
  limit?: number
}
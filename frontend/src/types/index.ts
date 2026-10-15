export interface RoomType {
  id: string
  name: string
  description: string
  basePrice: number
  maxGuests: number
}

export interface Room {
  id: string
  roomTypeId: string
  roomType?: RoomType
  number: string
  floor: number
  status: RoomStatus
  images: RoomImage[]
  createdAt: Date
  updatedAt: Date
}

export interface RoomImage {
  id: string
  roomId: string
  url: string
  caption: string
  sortOrder: number
}

export type RoomStatus = 'available' | 'occupied' | 'maintenance'

export interface TourPackage {
  id: string
  name: string
  description: string
  durationDays: number
  durationNights: number
  price: number
  category: TourCategory
  maxGroupSize: number
  isFeatured: boolean
  itinerary: TourItinerary[]
  createdAt: Date
  updatedAt: Date
}

export interface TourItinerary {
  id: string
  tourId: string
  dayNumber: number
  title: string
  description: string
  accommodation: string
  meals: string
}

export type TourCategory = 'adventure' | 'cultural' | 'beach' | 'pilgrimage' | 'wildlife'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  createdAt: Date
}

export type UserRole = 'customer' | 'admin'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
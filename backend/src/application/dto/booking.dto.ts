export interface CreateRoomBookingInput {
  roomId: string
  customerId: string
  checkIn: string
  checkOut: string
  notes?: string
}

export interface BookingFilterInput {
  customerId?: string
  roomId?: string
  status?: string
  fromDate?: string
  toDate?: string
  page?: number
  limit?: number
}

export interface CheckAvailabilityInput {
  roomId: string
  checkIn: string
  checkOut: string
}

export interface AvailabilityResult {
  roomId: string
  available: boolean
  checkIn: Date
  checkOut: Date
  conflictingBookingId?: string
}

export interface BookingResult {
  id: string
  bookingNumber: string
  status: string
  totalAmount: number
  roomId: string
  roomNumber: string
  checkIn: Date
  checkOut: Date
  totalNights: number
  createdAt: Date
}
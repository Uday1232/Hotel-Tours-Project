export interface CreateTourBookingInput {
  tourId: string
  customerId: string
  travelDate: string
  numberOfPeople: number
  notes?: string
}

export interface TourBookingFilterInput {
  customerId?: string
  tourId?: string
  status?: string
  fromDate?: string
  toDate?: string
  page?: number
  limit?: number
}
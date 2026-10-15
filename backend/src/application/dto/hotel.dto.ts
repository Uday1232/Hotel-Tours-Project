export interface CreateRoomTypeInput {
  name: string
  description: string
  basePrice: number
  maxGuests: number
}

export interface UpdateRoomTypeInput {
  name?: string
  description?: string
  basePrice?: number
  maxGuests?: number
  isActive?: boolean
}

export interface CreateRoomInput {
  roomTypeId: string
  number: string
  floor: number
}

export interface UpdateRoomInput {
  roomTypeId?: string
  number?: string
  floor?: number
  status?: string
  isActive?: boolean
}

export interface CreateRoomImageInput {
  roomId: string
  url: string
  caption?: string
  sortOrder?: number
  isPrimary?: boolean
}

export interface CreateAmenityInput {
  name: string
  icon?: string
  category?: string
}

export interface UpdateAmenityInput {
  name?: string
  icon?: string
  category?: string
  isActive?: boolean
}

export interface RoomFilterInput {
  roomTypeId?: string
  floor?: number
  status?: string
  isActive?: boolean
  minPrice?: number
  maxPrice?: number
  maxGuests?: number
  page?: number
  limit?: number
}
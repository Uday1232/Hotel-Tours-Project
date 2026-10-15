export interface RoomType {
  id: string
  name: string
  description: string
  basePrice: number
  maxGuests: number
}

export interface RoomImage {
  id: string
  url: string
  caption: string
}

export interface Amenity {
  id: string
  name: string
  icon: string
  category: string
}

export interface Room {
  id: string
  roomTypeId: string
  roomType: RoomType
  number: string
  floor: number
  status: string
  images: RoomImage[]
  amenities: Amenity[]
}

export interface TourItinerary {
  id: string
  dayNumber: number
  title: string
  description: string
  accommodation: string
  meals: string
}

export interface TourPackage {
  id: string
  name: string
  description: string
  durationDays: number
  durationNights: number
  price: number
  category: string
  maxGroupSize: number
  isFeatured: boolean
  images: RoomImage[]
  itinerary: TourItinerary[]
}

export const roomTypes: RoomType[] = [
  { id: '1', name: 'Standard', description: 'Comfortable room with basic amenities', basePrice: 2500, maxGuests: 2 },
  { id: '2', name: 'Deluxe', description: 'Spacious room with premium amenities and city view', basePrice: 4500, maxGuests: 2 },
  { id: '3', name: 'Suite', description: 'Luxury suite with separate living area and balcony', basePrice: 8000, maxGuests: 4 },
  { id: '4', name: 'Premium', description: 'Top-floor premium room with panoramic views', basePrice: 12000, maxGuests: 3 }
]

export const rooms: Room[] = [
  {
    id: '1', roomTypeId: '1', number: '101', floor: 1, status: 'AVAILABLE',
    roomType: roomTypes[0],
    images: [
      { id: '1', url: 'https://images.unsplash.com-1', caption: 'Room 101 - Main View' },
      { id: '2', url: 'https://images.unsplash.com-2', caption: 'Room 101 - Bathroom' }
    ],
    amenities: [
      { id: '1', name: 'WiFi', icon: 'wifi', category: 'connectivity' },
      { id: '2', name: 'AC', icon: 'snowflake', category: 'comfort' },
      { id: '3', name: 'TV', icon: 'tv', category: 'entertainment' }
    ]
  },
  {
    id: '2', roomTypeId: '2', number: '201', floor: 2, status: 'AVAILABLE',
    roomType: roomTypes[1],
    images: [
      { id: '3', url: 'https://images.unsplash.com-3', caption: 'Room 201 - Main View' },
      { id: '4', url: 'https://images.unsplash.com-4', caption: 'Room 201 - Bathroom' }
    ],
    amenities: [
      { id: '1', name: 'WiFi', icon: 'wifi', category: 'connectivity' },
      { id: '2', name: 'AC', icon: 'snowflake', category: 'comfort' },
      { id: '3', name: 'TV', icon: 'tv', category: 'entertainment' },
      { id: '4', name: 'Mini Bar', icon: 'glass', category: 'comfort' }
    ]
  },
  {
    id: '3', roomTypeId: '3', number: '301', floor: 3, status: 'AVAILABLE',
    roomType: roomTypes[2],
    images: [
      { id: '5', url: 'https://images.unsplash.com-5', caption: 'Suite 301 - Living Room' },
      { id: '6', url: 'https://images.unsplash.com-6', caption: 'Suite 301 - Bedroom' },
      { id: '7', url: 'https://images.unsplash.com-7', caption: 'Suite 301 - Balcony' }
    ],
    amenities: [
      { id: '1', name: 'WiFi', icon: 'wifi', category: 'connectivity' },
      { id: '2', name: 'AC', icon: 'snowflake', category: 'comfort' },
      { id: '3', name: 'TV', icon: 'tv', category: 'entertainment' },
      { id: '4', name: 'Mini Bar', icon: 'glass', category: 'comfort' },
      { id: '5', name: 'Balcony', icon: 'sun', category: 'comfort' }
    ]
  },
  {
    id: '4', roomTypeId: '4', number: '401', floor: 4, status: 'AVAILABLE',
    roomType: roomTypes[3],
    images: [
      { id: '8', url: 'https://images.unsplash.com-8', caption: 'Premium 401 - Panoramic View' },
      { id: '9', url: 'https://images.unsplash.com-9', caption: 'Premium 401 - Bedroom' }
    ],
    amenities: [
      { id: '1', name: 'WiFi', icon: 'wifi', category: 'connectivity' },
      { id: '2', name: 'AC', icon: 'snowflake', category: 'comfort' },
      { id: '3', name: 'TV', icon: 'tv', category: 'entertainment' },
      { id: '4', name: 'Mini Bar', icon: 'glass', category: 'comfort' },
      { id: '5', name: 'Jacuzzi', icon: 'bath', category: 'luxury' }
    ]
  }
]

export const tourPackages: TourPackage[] = [
  {
    id: '1', name: 'Mountain Adventure Trek', description: 'Exciting 3-day trek through scenic mountain trails with camping and bonfire night.',
    durationDays: 3, durationNights: 2, price: 12000, category: 'ADVENTURE', maxGroupSize: 15, isFeatured: true,
    images: [{ id: '10', url: 'https://images.unsplash.com-10', caption: 'Mountain Trek' }],
    itinerary: [
      { id: '1', dayNumber: 1, title: 'Arrival & Base Camp', description: 'Arrive at base camp, safety briefing.', accommodation: 'Camping Tents', meals: 'Lunch, Dinner' },
      { id: '2', dayNumber: 2, title: 'Summit Trek', description: 'Full day trek to summit.', accommodation: 'Camping Tents', meals: 'Breakfast, Lunch, Dinner' },
      { id: '3', dayNumber: 3, title: 'Descent & Departure', description: 'Morning descent, departure.', accommodation: 'None', meals: 'Breakfast' }
    ]
  },
  {
    id: '2', name: 'Heritage Cultural Tour', description: 'Immerse yourself in local culture with visits to historical sites and temples.',
    durationDays: 4, durationNights: 3, price: 18000, category: 'CULTURAL', maxGroupSize: 20, isFeatured: true,
    images: [{ id: '11', url: 'https://images.unsplash.com-11', caption: 'Cultural Tour' }],
    itinerary: [
      { id: '4', dayNumber: 1, title: 'City Heritage Walk', description: 'Guided walk through old city.', accommodation: 'Heritage Hotel', meals: 'Lunch, Dinner' },
      { id: '5', dayNumber: 2, title: 'Temple & Art Trail', description: 'Visit ancient temples.', accommodation: 'Heritage Hotel', meals: 'Breakfast, Lunch, Dinner' }
    ]
  },
  {
    id: '3', name: 'Beach Paradise Getaway', description: 'Relax at pristine beaches with water sports and sunset cruises.',
    durationDays: 3, durationNights: 2, price: 15000, category: 'BEACH', maxGroupSize: 12, isFeatured: false,
    images: [{ id: '12', url: 'https://images.unsplash.com-12', caption: 'Beach Getaway' }],
    itinerary: [
      { id: '6', dayNumber: 1, title: 'Beach Arrival', description: 'Arrive at beach resort.', accommodation: 'Beach Resort', meals: 'Lunch, Dinner' },
      { id: '7', dayNumber: 2, title: 'Water Sports Day', description: 'Snorkeling, jet skiing.', accommodation: 'Beach Resort', meals: 'Breakfast, Lunch, Dinner' }
    ]
  },
  {
    id: '4', name: 'Wildlife Safari Expedition', description: 'Experience the thrill of spotting exotic wildlife in their natural habitat.',
    durationDays: 5, durationNights: 4, price: 28000, category: 'WILDLIFE', maxGroupSize: 10, isFeatured: true,
    images: [{ id: '13', url: 'https://images.unsplash.com-13', caption: 'Wildlife Safari' }],
    itinerary: [
      { id: '8', dayNumber: 1, title: 'Arrival & Briefing', description: 'Arrive at jungle lodge.', accommodation: 'Jungle Lodge', meals: 'Lunch, Dinner' },
      { id: '9', dayNumber: 2, title: 'Morning Safari', description: 'Early morning jeep safari.', accommodation: 'Jungle Lodge', meals: 'Breakfast, Lunch, Dinner' }
    ]
  }
]
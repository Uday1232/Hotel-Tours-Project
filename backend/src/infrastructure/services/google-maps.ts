import axios from 'axios'

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || ''
const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

export interface PlaceResult {
  placeId: string
  name: string
  address: string
  rating: number | null
  totalRatings: number | null
  location: {
    lat: number
    lng: number
  }
  photoUrl: string | null
  isOpen: boolean | null
  types: string[]
}

export interface NearbySearchResult {
  places: PlaceResult[]
  nextPageToken: string | null
}

const PLACE_TYPE_MAP: Record<string, string> = {
  attractions: 'tourist_attraction',
  restaurants: 'restaurant',
  temples: 'hindu_temple',
  hospitals: 'hospital',
  bus_stand: 'bus_station',
  railway_station: 'train_station'
}

export async function searchNearby(
  lat: number,
  lng: number,
  type: string,
  radius: number = 5000
): Promise<NearbySearchResult> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new AppError('Google Maps API key not configured', 500)
  }

  const placeType = PLACE_TYPE_MAP[type] || type

  const response = await axios.get(`${PLACES_BASE_URL}/nearbysearch/json`, {
    params: {
      location: `${lat},${lng}`,
      radius,
      type: placeType,
      key: GOOGLE_MAPS_API_KEY
    }
  })

  if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
    throw new AppError(`Google Places API error: ${response.data.status}`, 502)
  }

  const places: PlaceResult[] = (response.data.results || []).map((place: any) => ({
    placeId: place.place_id,
    name: place.name,
    address: place.vicinity || place.formatted_address || '',
    rating: place.rating || null,
    totalRatings: place.user_ratings_total || null,
    location: {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng
    },
    photoUrl: place.photos?.[0]
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
      : null,
    isOpen: place.opening_hours?.open_now ?? null,
    types: place.types || []
  }))

  return {
    places,
    nextPageToken: response.data.next_page_token || null
  }
}

export async function getPlaceDetails(placeId: string): Promise<PlaceResult> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new AppError('Google Maps API key not configured', 500)
  }

  const response = await axios.get(`${PLACES_BASE_URL}/details/json`, {
    params: {
      place_id: placeId,
      fields: 'name,formatted_address,geometry,rating,user_ratings_total,photos,opening_hours,types,vicinity',
      key: GOOGLE_MAPS_API_KEY
    }
  })

  if (response.data.status !== 'OK') {
    throw new AppError(`Google Places API error: ${response.data.status}`, 502)
  }

  const place = response.data.result

  return {
    placeId: place.place_id,
    name: place.name,
    address: place.formatted_address || place.vicinity || '',
    rating: place.rating || null,
    totalRatings: place.user_ratings_total || null,
    location: {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng
    },
    photoUrl: place.photos?.[0]
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
      : null,
    isOpen: place.opening_hours?.open_now ?? null,
    types: place.types || []
  }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
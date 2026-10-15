import { Request, Response, NextFunction } from 'express'
import { PlacesUseCase } from '../../application/use-cases/places/places'

const placesUseCase = new PlacesUseCase()

function getLatLng(req: Request) {
  const lat = parseFloat(req.query.lat as string)
  const lng = parseFloat(req.query.lng as string)
  const radius = req.query.radius ? parseInt(req.query.radius as string) : undefined

  if (isNaN(lat) || isNaN(lng)) {
    throw new AppError('lat and lng query parameters are required', 400)
  }

  return { lat, lng, radius }
}

export async function getNearbyAttractions(req: Request, res: Response, next: NextFunction) {
  try {
    const { lat, lng, radius } = getLatLng(req)
    const result = await placesUseCase.getNearbyAttractions(lat, lng, radius)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getNearbyRestaurants(req: Request, res: Response, next: NextFunction) {
  try {
    const { lat, lng, radius } = getLatLng(req)
    const result = await placesUseCase.getNearbyRestaurants(lat, lng, radius)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getNearbyTemples(req: Request, res: Response, next: NextFunction) {
  try {
    const { lat, lng, radius } = getLatLng(req)
    const result = await placesUseCase.getNearbyTemples(lat, lng, radius)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getNearbyHospitals(req: Request, res: Response, next: NextFunction) {
  try {
    const { lat, lng, radius } = getLatLng(req)
    const result = await placesUseCase.getNearbyHospitals(lat, lng, radius)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getNearbyBusStand(req: Request, res: Response, next: NextFunction) {
  try {
    const { lat, lng, radius } = getLatLng(req)
    const result = await placesUseCase.getNearbyBusStand(lat, lng, radius)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getNearbyRailwayStation(req: Request, res: Response, next: NextFunction) {
  try {
    const { lat, lng, radius } = getLatLng(req)
    const result = await placesUseCase.getNearbyRailwayStation(lat, lng, radius)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getPlaceDetails(req: Request<{ placeId: string }>, res: Response, next: NextFunction) {
  try {
    const result = await placesUseCase.getPlaceDetails(req.params.placeId)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'AppError'
  }
}
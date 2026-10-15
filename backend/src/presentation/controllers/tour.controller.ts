import { Request, Response, NextFunction } from 'express'
import { TourPackageUseCase } from '../../application/use-cases/tour-package/tour-package'
import { TourItineraryUseCase } from '../../application/use-cases/tour-package/tour-itinerary'
import { TourImageUseCase } from '../../application/use-cases/tour-package/tour-image'

const tourUseCase = new TourPackageUseCase()
const itineraryUseCase = new TourItineraryUseCase()
const tourImageUseCase = new TourImageUseCase()

type IdParam = { id: string }
type TourIdParam = { tourId: string }

// Tour Package handlers
export async function createTour(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await tourUseCase.create(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getTours(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await tourUseCase.getAll(req.query as any)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getTourById(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await tourUseCase.getById(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function updateTour(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await tourUseCase.update(req.params.id, req.body)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function deleteTour(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    await tourUseCase.delete(req.params.id)
    res.status(204).send()
  } catch (error) { next(error) }
}

export async function getFeaturedTours(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await tourUseCase.getFeatured()
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getToursByCategory(req: Request<{ category: string }>, res: Response, next: NextFunction) {
  try {
    const result = await tourUseCase.getByCategory(req.params.category)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

// Itinerary handlers
export async function addItineraryDay(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await itineraryUseCase.addDay(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getItineraryByTourId(req: Request<TourIdParam>, res: Response, next: NextFunction) {
  try {
    const result = await itineraryUseCase.getByTourId(req.params.tourId)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function updateItineraryDay(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await itineraryUseCase.update(req.params.id, req.body)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function deleteItineraryDay(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    await itineraryUseCase.delete(req.params.id)
    res.status(204).send()
  } catch (error) { next(error) }
}

export async function reorderItinerary(req: Request<TourIdParam>, res: Response, next: NextFunction) {
  try {
    const result = await itineraryUseCase.reorder(req.params.tourId, req.body.dayIds)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

// Tour Image handlers
export async function addTourImage(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await tourImageUseCase.addImage(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function getTourImages(req: Request<TourIdParam>, res: Response, next: NextFunction) {
  try {
    const result = await tourImageUseCase.getByTourId(req.params.tourId)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function deleteTourImage(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    await tourImageUseCase.delete(req.params.id)
    res.status(204).send()
  } catch (error) { next(error) }
}

export async function setPrimaryTourImage(req: Request<IdParam>, res: Response, next: NextFunction) {
  try {
    const result = await tourImageUseCase.setPrimary(req.params.id)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}

export async function reorderTourImages(req: Request<TourIdParam>, res: Response, next: NextFunction) {
  try {
    const result = await tourImageUseCase.reorder(req.params.tourId, req.body.imageIds)
    res.status(200).json({ success: true, data: result })
  } catch (error) { next(error) }
}
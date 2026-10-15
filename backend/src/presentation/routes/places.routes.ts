import { Router } from 'express'
import {
  getNearbyAttractions,
  getNearbyRestaurants,
  getNearbyTemples,
  getNearbyHospitals,
  getNearbyBusStand,
  getNearbyRailwayStation,
  getPlaceDetails
} from '../controllers/places.controller'

const router = Router()

router.get('/attractions', getNearbyAttractions)
router.get('/restaurants', getNearbyRestaurants)
router.get('/temples', getNearbyTemples)
router.get('/hospitals', getNearbyHospitals)
router.get('/bus-stand', getNearbyBusStand)
router.get('/railway-station', getNearbyRailwayStation)
router.get('/details/:placeId', getPlaceDetails)

export default router
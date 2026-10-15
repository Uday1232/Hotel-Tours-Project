import { searchNearby, getPlaceDetails } from '../../../infrastructure/services/google-maps'

export class PlacesUseCase {
  async getNearbyAttractions(lat: number, lng: number, radius?: number) {
    return searchNearby(lat, lng, 'attractions', radius)
  }

  async getNearbyRestaurants(lat: number, lng: number, radius?: number) {
    return searchNearby(lat, lng, 'restaurants', radius)
  }

  async getNearbyTemples(lat: number, lng: number, radius?: number) {
    return searchNearby(lat, lng, 'temples', radius)
  }

  async getNearbyHospitals(lat: number, lng: number, radius?: number) {
    return searchNearby(lat, lng, 'hospitals', radius)
  }

  async getNearbyBusStand(lat: number, lng: number, radius?: number) {
    return searchNearby(lat, lng, 'bus_stand', radius)
  }

  async getNearbyRailwayStation(lat: number, lng: number, radius?: number) {
    return searchNearby(lat, lng, 'railway_station', radius)
  }

  async getPlaceDetails(placeId: string) {
    return getPlaceDetails(placeId)
  }
}
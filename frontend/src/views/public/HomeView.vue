<template>
  <PublicLayout>
    <section class="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div class="absolute inset-0 bg-black opacity-40"></div>
      <div class="relative container mx-auto px-4 py-32 md:py-48">
        <div class="max-w-2xl">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">Welcome to Hotel & Tours</h1>
          <p class="text-xl md:text-2xl mb-8 text-gray-200">Your perfect stay and unforgettable journeys await. Experience luxury hospitality combined with amazing travel packages.</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <router-link to="/rooms" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-center">
              View Rooms
            </router-link>
            <router-link to="/tours" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition text-center">
              Explore Tours
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">We provide the best hospitality services with modern amenities and unforgettable experiences.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Premium Rooms</h3>
            <p class="text-gray-600">Luxurious rooms with modern amenities and stunning views.</p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Amazing Tours</h3>
            <p class="text-gray-600">Curated travel packages for adventure, culture, and relaxation.</p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-md text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Easy Booking</h3>
            <p class="text-gray-600">Simple and quick booking process with instant confirmation.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Featured Rooms</h2>
          <p class="text-gray-600">Choose from our selection of comfortable rooms.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="room in rooms" :key="room.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
              <img v-if="getPrimaryImage(room)" :src="getPrimaryImage(room)" class="w-full h-full object-cover">
              <svg v-else class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-lg">{{ room.roomType?.name }}</h3>
              <p class="text-gray-500 text-sm">Room {{ room.number }} • Floor {{ room.floor }}</p>
              <p class="text-blue-600 font-bold mt-2">₹{{ room.roomType?.basePrice }}/night</p>
              <router-link :to="`/rooms/${room.id}`" class="block mt-3 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                View Details
              </router-link>
            </div>
          </div>
        </div>
        <div class="text-center mt-8">
          <router-link to="/rooms" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            View All Rooms
          </router-link>
        </div>
      </div>
    </section>

    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Featured Tours</h2>
          <p class="text-gray-600">Explore our most popular travel packages.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="tour in featuredTours" :key="tour.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div class="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
              <img v-if="getTourPrimaryImage(tour)" :src="getTourPrimaryImage(tour)" class="w-full h-full object-cover">
              <svg v-else class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-lg">{{ tour.name }}</h3>
                <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{{ tour.category }}</span>
              </div>
              <p class="text-gray-500 text-sm mb-2">{{ tour.durationDays }}D / {{ tour.durationNights }}N</p>
              <p class="text-blue-600 font-bold">₹{{ tour.price }}/person</p>
              <router-link :to="`/tours/${tour.id}`" class="block mt-3 text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm">
                View Details
              </router-link>
            </div>
          </div>
        </div>
        <div class="text-center mt-8">
          <router-link to="/tours" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            View All Tours
          </router-link>
        </div>
      </div>
    </section>

    <section class="py-16 bg-blue-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to Book?</h2>
        <p class="text-xl mb-8 text-blue-100">Contact us now for the best deals and personalized packages.</p>
        <a href="https://wa.me/919999999999" target="_blank" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
          Chat on WhatsApp
        </a>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import apiClient from '@/services/api'

const rooms = ref<any[]>([])
const featuredTours = ref<any[]>([])

function getPrimaryImage(room: any) {
  const primary = room.images?.find((i: any) => i.isPrimary)
  return primary?.url || room.images?.[0]?.url || null
}

function getTourPrimaryImage(tour: any) {
  const primary = tour.images?.find((i: any) => i.isPrimary)
  return primary?.url || tour.images?.[0]?.url || null
}

onMounted(async () => {
  try {
    const [roomsRes, toursRes] = await Promise.all([
      apiClient.get('/hotel/rooms'),
      apiClient.get('/tours/tours/featured'),
    ])
    rooms.value = (roomsRes.data.data.rooms || roomsRes.data.data || []).slice(0, 4)
    featuredTours.value = (toursRes.data.data.tours || toursRes.data.data || []).slice(0, 3)
  } catch (err) {
    console.error('Failed to load home data:', err)
  }
})
</script>
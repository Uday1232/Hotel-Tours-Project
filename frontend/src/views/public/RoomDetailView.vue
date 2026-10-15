<template>
  <PublicLayout>
    <div v-if="room" class="container mx-auto px-4 py-8">
      <nav class="text-sm text-gray-500 mb-6">
        <router-link to="/" class="hover:text-blue-600">Home</router-link>
        <span class="mx-2">/</span>
        <router-link to="/rooms" class="hover:text-blue-600">Rooms</router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-800">Room {{ room.number }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <RoomGallery :images="room.images || []" />
        </div>

        <div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800">{{ room.roomType?.name }} Room</h1>
              <p class="text-gray-500">Room {{ room.number }} • Floor {{ room.floor }}</p>
            </div>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">{{ room.status }}</span>
          </div>

          <div class="mb-6">
            <p class="text-3xl font-bold text-blue-600">₹{{ room.roomType?.basePrice }}<span class="text-lg font-normal text-gray-500">/night</span></p>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Description</h3>
            <p class="text-gray-600">{{ room.roomType?.description }}</p>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Capacity</h3>
            <div class="flex items-center text-gray-600">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Up to {{ room.roomType?.maxGuests }} guests
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Amenities</h3>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="amenity in room.amenities || []" :key="amenity.id || amenity.amenityId" class="flex items-center text-gray-600">
                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                {{ amenity.amenity?.name || amenity.name }}
              </div>
            </div>
          </div>

          <div class="flex gap-4">
            <router-link :to="`/booking?roomId=${room.id}`" class="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Book Now
            </router-link>
            <a href="https://wa.me/919999999999" target="_blank" class="flex-1 bg-green-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-600 transition">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Other Available Rooms</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="otherRoom in otherRooms" :key="otherRoom.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div class="h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden">
              <img v-if="getPrimaryImage(otherRoom)" :src="getPrimaryImage(otherRoom)" class="w-full h-full object-cover">
              <svg v-else class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div class="p-4">
              <h3 class="font-semibold">{{ otherRoom.roomType?.name }}</h3>
              <p class="text-blue-600 font-bold">₹{{ otherRoom.roomType?.basePrice }}/night</p>
              <router-link :to="`/rooms/${otherRoom.id}`" class="block mt-2 text-blue-600 hover:underline text-sm">View Details →</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="container mx-auto px-4 py-16 text-center">
      <p class="text-gray-500">Loading room details...</p>
    </div>

    <div v-else class="container mx-auto px-4 py-16 text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Room Not Found</h2>
      <router-link to="/rooms" class="text-blue-600 hover:underline">← Back to Rooms</router-link>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import RoomGallery from '@/components/RoomGallery.vue'
import apiClient from '@/services/api'

const route = useRoute()
const room = ref<any>(null)
const allRooms = ref<any[]>([])
const loading = ref(true)

const otherRooms = computed(() => allRooms.value.filter(r => r.id !== room.value?.id).slice(0, 3))

function getPrimaryImage(r: any) {
  const primary = r.images?.find((i: any) => i.isPrimary)
  return primary?.url || r.images?.[0]?.url || null
}

async function fetchRoom() {
  loading.value = true
  try {
    const [roomRes, roomsRes] = await Promise.all([
      apiClient.get(`/hotel/rooms/${route.params.id}`),
      apiClient.get('/hotel/rooms'),
    ])
    room.value = roomRes.data.data
    const roomsData = roomsRes.data.data
    allRooms.value = roomsData.rooms || roomsData || []
  } catch (err) {
    room.value = null
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, fetchRoom)
onMounted(fetchRoom)
</script>
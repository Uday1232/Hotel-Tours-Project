<template>
  <PublicLayout>
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-4">Our Rooms</h1>
        <p class="text-blue-100">Choose from our selection of comfortable and luxurious rooms.</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <select v-model="selectedType" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Room Types</option>
          <option v-for="type in roomTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
        </select>
        <select v-model="sortBy" class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="guests">Max Guests</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="room in filteredRooms" :key="room.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
          <div class="h-56 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative overflow-hidden">
            <img v-if="getPrimaryImage(room)" :src="getPrimaryImage(room)" class="w-full h-full object-cover">
            <svg v-else class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <span class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Available</span>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg">{{ room.roomType?.name }}</h3>
              <span class="text-blue-600 font-bold">₹{{ room.roomType?.basePrice }}</span>
            </div>
            <p class="text-gray-500 text-sm mb-2">Room {{ room.number }} • Floor {{ room.floor }}</p>
            <p class="text-gray-600 text-sm mb-3">{{ room.roomType?.description }}</p>
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Up to {{ room.roomType?.maxGuests }} guests
            </div>
            <router-link :to="`/rooms/${room.id}`" class="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition">
              View Details
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="filteredRooms.length === 0 && !loading" class="text-center py-12">
        <p class="text-gray-500">No rooms found matching your criteria.</p>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import apiClient from '@/services/api'

const allRooms = ref<any[]>([])
const roomTypes = ref<any[]>([])
const selectedType = ref('')
const sortBy = ref('price-asc')
const loading = ref(true)

function getPrimaryImage(room: any) {
  const primary = room.images?.find((i: any) => i.isPrimary)
  return primary?.url || room.images?.[0]?.url || null
}

const filteredRooms = computed(() => {
  let result = [...allRooms.value]
  if (selectedType.value) {
    result = result.filter(r => r.roomTypeId === selectedType.value)
  }
  result.sort((a: any, b: any) => {
    switch (sortBy.value) {
      case 'price-asc': return (a.roomType?.basePrice || 0) - (b.roomType?.basePrice || 0)
      case 'price-desc': return (b.roomType?.basePrice || 0) - (a.roomType?.basePrice || 0)
      case 'guests': return (b.roomType?.maxGuests || 0) - (a.roomType?.maxGuests || 0)
      default: return 0
    }
  })
  return result
})

onMounted(async () => {
  try {
    const [roomsRes, typesRes] = await Promise.all([
      apiClient.get('/hotel/rooms'),
      apiClient.get('/hotel/room-types'),
    ])
    const data = roomsRes.data.data
    allRooms.value = data.rooms || data || []
    roomTypes.value = typesRes.data.data || []
  } catch (err) {
    console.error('Failed to load rooms:', err)
  } finally {
    loading.value = false
  }
})
</script>
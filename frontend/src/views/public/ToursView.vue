<template>
  <PublicLayout>
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-4">Tour Packages</h1>
        <p class="text-blue-100">Explore our curated travel experiences.</p>
      </div>
    </div>
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="tour in tours" :key="tour.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
          <div class="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
            <img v-if="getPrimaryImage(tour)" :src="getPrimaryImage(tour)" class="w-full h-full object-cover">
            <svg v-else class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg">{{ tour.name }}</h3>
              <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{{ tour.category }}</span>
            </div>
            <p class="text-gray-500 text-sm mb-2">{{ tour.durationDays }}D / {{ tour.durationNights }}N • Max {{ tour.maxGroupSize }}</p>
            <p class="text-gray-600 text-sm mb-3">{{ tour.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-blue-600 font-bold text-lg">₹{{ tour.price }}</span>
              <router-link :to="`/tours/${tour.id}`" class="text-blue-600 hover:underline text-sm">View Details →</router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!tours.length && !loading" class="text-center py-12">
        <p class="text-gray-500">No tours available.</p>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import apiClient from '@/services/api'

const tours = ref<any[]>([])
const loading = ref(true)

function getPrimaryImage(tour: any) {
  const primary = tour.images?.find((i: any) => i.isPrimary)
  return primary?.url || tour.images?.[0]?.url || null
}

onMounted(async () => {
  try {
    const res = await apiClient.get('/tours/tours')
    const data = res.data.data
    tours.value = data.tours || data || []
  } catch (err) {
    console.error('Failed to load tours:', err)
  } finally {
    loading.value = false
  }
})
</script>
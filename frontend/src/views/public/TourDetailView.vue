<template>
  <PublicLayout>
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-4">{{ tour?.name || 'Tour Details' }}</h1>
        <p class="text-blue-100">{{ tour?.category }} • {{ tour?.durationDays }}D / {{ tour?.durationNights }}N</p>
      </div>
    </div>
    <div v-if="tour" class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="h-64 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-8 overflow-hidden">
            <img v-if="primaryImage" :src="primaryImage" class="w-full h-full object-cover">
            <svg v-else class="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 class="text-2xl font-bold mb-4">About This Tour</h2>
          <p class="text-gray-600 mb-8">{{ tour.description }}</p>

          <h3 class="text-xl font-bold mb-4">Itinerary</h3>
          <div class="space-y-4">
            <div v-for="day in itinerary" :key="day.id" class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold text-blue-600">Day {{ day.dayNumber }}: {{ day.title }}</h4>
              <p class="text-gray-600 text-sm mt-1">{{ day.description }}</p>
              <div class="flex gap-4 mt-2 text-sm text-gray-500">
                <span v-if="day.accommodation">🏨 {{ day.accommodation }}</span>
                <span v-if="day.meals">🍽️ {{ day.meals }}</span>
              </div>
            </div>
            <p v-if="!itinerary.length" class="text-gray-400 text-sm">Itinerary details not available</p>
          </div>

          <div v-if="tour.images?.length > 1" class="mt-8">
            <h3 class="text-xl font-bold mb-4">Gallery</h3>
            <div class="grid grid-cols-3 gap-3">
              <img v-for="img in tour.images" :key="img.id" :src="img.url"
                class="h-32 w-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition">
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white border rounded-lg p-6 sticky top-24">
            <div class="text-center mb-6">
              <p class="text-3xl font-bold text-blue-600">₹{{ tour.price }}</p>
              <p class="text-gray-500">per person</p>
            </div>
            <div class="space-y-3 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Duration</span>
                <span class="font-medium">{{ tour.durationDays }} Days / {{ tour.durationNights }} Nights</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Max Group</span>
                <span class="font-medium">{{ tour.maxGroupSize }} people</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Category</span>
                <span class="font-medium">{{ tour.category }}</span>
              </div>
            </div>
            <router-link :to="`/tour-booking?tourId=${tour.id}`" class="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Book This Tour
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="loading" class="container mx-auto px-4 py-16 text-center">
      <p class="text-gray-500">Loading tour details...</p>
    </div>
    <div v-else class="container mx-auto px-4 py-16 text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Tour Not Found</h2>
      <router-link to="/tours" class="text-blue-600 hover:underline">← Back to Tours</router-link>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import apiClient from '@/services/api'

const route = useRoute()
const tour = ref<any>(null)
const itinerary = ref<any[]>([])
const loading = ref(true)

const primaryImage = computed(() => {
  if (!tour.value?.images?.length) return null
  const primary = tour.value.images.find((i: any) => i.isPrimary)
  return primary?.url || tour.value.images[0]?.url || null
})

async function fetchTour() {
  loading.value = true
  try {
    const [tourRes, itinRes] = await Promise.all([
      apiClient.get(`/tours/tours/${route.params.id}`),
      apiClient.get(`/tours/tours/${route.params.id}/itinerary`),
    ])
    tour.value = tourRes.data.data
    itinerary.value = itinRes.data.data || []
  } catch (err) {
    tour.value = null
    itinerary.value = []
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, fetchTour)
onMounted(fetchTour)
</script>
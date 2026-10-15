<template>
  <PublicLayout>
    <div class="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-2">Book a Tour</h1>
        <p class="text-green-100">Select your tour and travel date to get started.</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-lg font-semibold mb-4">Select Tour</h2>
            <div class="space-y-3">
              <div v-for="tour in tours" :key="tour.id"
                @click="selectedTour = tour"
                class="border rounded-lg p-4 cursor-pointer transition"
                :class="selectedTour?.id === tour.id ? 'border-green-500 bg-green-50' : 'hover:border-gray-300'">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold">{{ tour.name }}</h3>
                    <p class="text-sm text-gray-500">{{ tour.durationDays }}D / {{ tour.durationNights }}N • {{ tour.category }} • Max {{ tour.maxGroupSize }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ tour.description }}</p>
                  </div>
                  <p class="text-green-600 font-bold whitespace-nowrap">₹{{ tour.price }}/person</p>
                </div>
              </div>
              <p v-if="!tours.length" class="text-center text-gray-400 py-4">No tours available</p>
            </div>
          </div>

          <div v-if="selectedTour" class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-lg font-semibold mb-4">Itinerary</h2>
            <div class="space-y-3">
              <div v-for="day in itinerary" :key="day.id" class="border-l-4 border-green-500 pl-4">
                <h4 class="font-medium">Day {{ day.dayNumber }}: {{ day.title }}</h4>
                <p class="text-sm text-gray-600">{{ day.description }}</p>
                <p class="text-xs text-gray-500 mt-1">🏨 {{ day.accommodation }} • 🍽️ {{ day.meals }}</p>
              </div>
              <p v-if="!itinerary.length" class="text-gray-400 text-sm">Itinerary details not available</p>
            </div>
          </div>

          <div v-if="selectedTour" class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Your Details</h2>
            <form @submit.prevent="submitBooking" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input v-model="customerName" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input v-model="customerEmail" type="email" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input v-model="customerPhone" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                  <input v-model="travelDate" type="date" :min="today" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
                  <input v-model.number="numberOfPeople" type="number" min="1" :max="selectedTour.maxGroupSize" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none">
                </div>
              </div>
              <div v-if="bookingError" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{{ bookingError }}</div>
              <button type="submit" :disabled="booking" class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
                {{ booking ? 'Booking...' : 'Confirm Tour Booking' }}
              </button>
            </form>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-24">
            <h3 class="text-lg font-semibold mb-4">Booking Summary</h3>
            <div v-if="selectedTour" class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Tour</span>
                <span class="font-medium">{{ selectedTour.name }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Duration</span>
                <span>{{ selectedTour.durationDays }}D / {{ selectedTour.durationNights }}N</span>
              </div>
              <div v-if="travelDate" class="flex justify-between text-sm">
                <span class="text-gray-500">Travel Date</span>
                <span>{{ travelDate }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Price/Person</span>
                <span>₹{{ selectedTour.price }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">People</span>
                <span>{{ numberOfPeople }}</span>
              </div>
              <hr>
              <div class="flex justify-between font-semibold">
                <span>Total</span>
                <span class="text-green-600">₹{{ totalAmount }}</span>
              </div>
            </div>
            <div v-else class="text-center text-gray-400 py-4">
              Select a tour to see summary
            </div>
          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import apiClient from '@/services/api'

const today = new Date().toISOString().split('T')[0]
const tours = ref<any[]>([])
const selectedTour = ref<any>(null)
const itinerary = ref<any[]>([])
const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const travelDate = ref('')
const numberOfPeople = ref(1)
const booking = ref(false)
const bookingError = ref('')

const totalAmount = computed(() => (selectedTour.value?.price || 0) * numberOfPeople.value)

watch(selectedTour, async (tour) => {
  if (!tour) { itinerary.value = []; return }
  try {
    const res = await apiClient.get(`/tours/tours/${tour.id}/itinerary`)
    itinerary.value = res.data.data || []
  } catch { itinerary.value = [] }
})

async function submitBooking() {
  booking.value = true
  bookingError.value = ''
  try {
    const res = await apiClient.post('/tour-bookings', {
      tourId: selectedTour.value.id,
      travelDate: travelDate.value,
      numberOfPeople: numberOfPeople.value,
      customerName: customerName.value,
      customerEmail: customerEmail.value,
      customerPhone: customerPhone.value,
    })
    alert(`Tour booking confirmed! Booking Number: ${res.data.data.bookingNumber}`)
    selectedTour.value = null
    travelDate.value = ''
    numberOfPeople.value = 1
  } catch (err: any) {
    bookingError.value = err.response?.data?.error || 'Booking failed. Please try again.'
  } finally {
    booking.value = false
  }
}

onMounted(async () => {
  try {
    const res = await apiClient.get('/tours/tours')
    tours.value = res.data.data || []
  } catch { tours.value = [] }
})
</script>
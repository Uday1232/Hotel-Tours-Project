<template>
  <PublicLayout>
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl font-bold mb-2">Book a Room</h1>
        <p class="text-blue-100">Select your dates and complete your reservation.</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-lg font-semibold mb-4">Select Dates</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                <input v-model="checkIn" type="date" :min="today" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                <input v-model="checkOut" type="date" :min="checkIn || today" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="text-lg font-semibold mb-4">Available Rooms</h2>
            <div v-if="checkingAvailability" class="text-center py-4 text-gray-500">Checking availability...</div>
            <div v-else-if="availableRooms.length === 0" class="text-center py-4 text-gray-400">
              {{ checkIn && checkOut ? 'No rooms available for selected dates' : 'Select dates to see available rooms' }}
            </div>
            <div v-else class="space-y-3">
              <div v-for="room in availableRooms" :key="room.id"
                @click="selectedRoom = room"
                class="border rounded-lg p-4 cursor-pointer transition"
                :class="selectedRoom?.id === room.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold">{{ room.roomType?.name }} — Room {{ room.number }}</h3>
                    <p class="text-sm text-gray-500">Floor {{ room.floor }} • Up to {{ room.roomType?.maxGuests }} guests</p>
                  </div>
                  <p class="text-blue-600 font-bold">₹{{ room.roomType?.basePrice }}/night</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedRoom && checkIn && checkOut" class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Your Details</h2>
            <form @submit.prevent="submitBooking" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input v-model="customerName" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input v-model="customerEmail" type="email" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input v-model="customerPhone" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
              </div>
              <div v-if="bookingError" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{{ bookingError }}</div>
              <button type="submit" :disabled="booking" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                {{ booking ? 'Booking...' : 'Confirm Booking' }}
              </button>
            </form>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-24">
            <h3 class="text-lg font-semibold mb-4">Booking Summary</h3>
            <div v-if="selectedRoom && checkIn && checkOut" class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Room</span>
                <span class="font-medium">{{ selectedRoom.roomType?.name }} #{{ selectedRoom.number }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Check-in</span>
                <span>{{ checkIn }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Check-out</span>
                <span>{{ checkOut }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">Nights</span>
                <span>{{ totalNights }}</span>
              </div>
              <hr>
              <div class="flex justify-between font-semibold">
                <span>Total</span>
                <span class="text-blue-600">₹{{ totalAmount }}</span>
              </div>
            </div>
            <div v-else class="text-center text-gray-400 py-4">
              Select dates and a room to see summary
            </div>
          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PublicLayout from '@/components/layout/PublicLayout.vue'
import apiClient from '@/services/api'

const today = new Date().toISOString().split('T')[0]
const checkIn = ref('')
const checkOut = ref('')
const availableRooms = ref<any[]>([])
const selectedRoom = ref<any>(null)
const checkingAvailability = ref(false)
const customerName = ref('')
const customerEmail = ref('')
const customerPhone = ref('')
const booking = ref(false)
const bookingError = ref('')

const totalNights = computed(() => {
  if (!checkIn.value || !checkOut.value) return 0
  const diff = new Date(checkOut.value).getTime() - new Date(checkIn.value).getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const totalAmount = computed(() => {
  return (selectedRoom.value?.roomType?.basePrice || 0) * totalNights.value
})

watch([checkIn, checkOut], async ([ci, co]) => {
  if (!ci || !co) { availableRooms.value = []; return }
  checkingAvailability.value = true
  selectedRoom.value = null
  try {
    const res = await apiClient.get('/hotel/rooms')
    const rooms = res.data.data || []
    const available = []
    for (const room of rooms) {
      if (room.status === 'MAINTENANCE') continue
      try {
        const check = await apiClient.get('/bookings/availability', {
          params: { roomId: room.id, checkIn: ci, checkOut: co }
        })
        if (check.data.data?.available) available.push(room)
      } catch { available.push(room) }
    }
    availableRooms.value = available
  } catch {
    availableRooms.value = []
  } finally {
    checkingAvailability.value = false
  }
})

async function submitBooking() {
  booking.value = true
  bookingError.value = ''
  try {
    const res = await apiClient.post('/bookings', {
      roomId: selectedRoom.value.id,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      customerName: customerName.value,
      customerEmail: customerEmail.value,
      customerPhone: customerPhone.value,
    })
    alert(`Booking confirmed! Booking Number: ${res.data.data.bookingNumber}`)
    selectedRoom.value = null
    checkIn.value = ''
    checkOut.value = ''
  } catch (err: any) {
    bookingError.value = err.response?.data?.error || 'Booking failed. Please try again.'
  } finally {
    booking.value = false
  }
}
</script>
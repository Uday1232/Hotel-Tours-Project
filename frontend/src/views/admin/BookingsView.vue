<template>
  <AdminLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Manage Bookings</h1>
        <button @click="openOfflineModal" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Offline Booking
        </button>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b flex flex-col md:flex-row gap-3">
          <select v-model="activeTab" class="px-3 py-2 border rounded-lg text-sm font-medium">
            <option value="room">Room Bookings</option>
            <option value="tour">Tour Bookings</option>
          </select>
          <select v-model="filterStatus" class="px-3 py-2 border rounded-lg text-sm">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="CHECKED_OUT">Checked Out</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div v-if="activeTab === 'room'">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-4 py-3 font-medium">Booking #</th>
                <th class="text-left px-4 py-3 font-medium">Customer</th>
                <th class="text-left px-4 py-3 font-medium">Room</th>
                <th class="text-left px-4 py-3 font-medium">Check In</th>
                <th class="text-left px-4 py-3 font-medium">Check Out</th>
                <th class="text-left px-4 py-3 font-medium">Amount</th>
                <th class="text-left px-4 py-3 font-medium">Status</th>
                <th class="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in roomBookings" :key="b.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-blue-600">{{ b.bookingNumber }}</td>
                <td class="px-4 py-3">{{ b.customer?.name || '-' }}</td>
                <td class="px-4 py-3">{{ b.bookingRooms?.[0]?.room?.number || '-' }}</td>
                <td class="px-4 py-3">{{ formatDate(b.bookingRooms?.[0]?.checkIn) }}</td>
                <td class="px-4 py-3">{{ formatDate(b.bookingRooms?.[0]?.checkOut) }}</td>
                <td class="px-4 py-3 font-medium">₹{{ b.totalAmount }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded text-xs font-medium" :class="statusClass(b.status)">{{ b.status }}</span>
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button v-if="b.status === 'CONFIRMED'" @click="checkIn(b.id)" class="text-green-600 hover:underline text-xs">Check In</button>
                  <button v-if="b.status === 'CHECKED_IN'" @click="checkOut(b.id)" class="text-blue-600 hover:underline text-xs">Check Out</button>
                  <button v-if="['PENDING','CONFIRMED'].includes(b.status)" @click="cancelBooking(b.id)" class="text-red-600 hover:underline text-xs">Cancel</button>
                </td>
              </tr>
              <tr v-if="!roomBookings.length">
                <td colspan="8" class="px-4 py-8 text-center text-gray-400">No room bookings found</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'tour'">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left px-4 py-3 font-medium">Booking #</th>
                <th class="text-left px-4 py-3 font-medium">Customer</th>
                <th class="text-left px-4 py-3 font-medium">Tour</th>
                <th class="text-left px-4 py-3 font-medium">Travel Date</th>
                <th class="text-left px-4 py-3 font-medium">People</th>
                <th class="text-left px-4 py-3 font-medium">Amount</th>
                <th class="text-left px-4 py-3 font-medium">Status</th>
                <th class="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in tourBookings" :key="b.id" class="border-t hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-blue-600">{{ b.bookingNumber }}</td>
                <td class="px-4 py-3">{{ b.customer?.name || '-' }}</td>
                <td class="px-4 py-3">{{ b.bookingTours?.[0]?.tour?.name || '-' }}</td>
                <td class="px-4 py-3">{{ formatDate(b.bookingTours?.[0]?.travelDate) }}</td>
                <td class="px-4 py-3">{{ b.bookingTours?.[0]?.numberOfPeople || '-' }}</td>
                <td class="px-4 py-3 font-medium">₹{{ b.totalAmount }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded text-xs font-medium" :class="statusClass(b.status)">{{ b.status }}</span>
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                  <button v-if="b.status === 'PENDING'" @click="confirmTour(b.id)" class="text-green-600 hover:underline text-xs">Confirm</button>
                  <button v-if="b.status === 'CONFIRMED'" @click="completeTour(b.id)" class="text-blue-600 hover:underline text-xs">Complete</button>
                  <button v-if="['PENDING','CONFIRMED'].includes(b.status)" @click="cancelTourBooking(b.id)" class="text-red-600 hover:underline text-xs">Cancel</button>
                </td>
              </tr>
              <tr v-if="!tourBookings.length">
                <td colspan="8" class="px-4 py-8 text-center text-gray-400">No tour bookings found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Offline Booking Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Offline Booking</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          <form @submit.prevent="submitOfflineBooking" class="space-y-4">
            <!-- Booking Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
              <select v-model="form.bookingType" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="room">Room Booking</option>
                <option value="tour">Tour Booking</option>
              </select>
            </div>

            <!-- Customer Details -->
            <div class="border-t pt-4">
              <p class="text-sm font-medium text-gray-700 mb-3">Customer Details</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Name *</label>
                  <input v-model="form.customerName" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Phone *</label>
                  <input v-model="form.customerPhone" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs text-gray-500 mb-1">Email *</label>
                  <input v-model="form.customerEmail" type="email" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
              </div>
            </div>

            <!-- Room Booking Fields -->
            <div v-if="form.bookingType === 'room'" class="border-t pt-4">
              <p class="text-sm font-medium text-gray-700 mb-3">Room Details</p>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Select Room *</label>
                  <select v-model="form.roomId" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="">Select a room</option>
                    <option v-for="r in rooms" :key="r.id" :value="r.id">
                      {{ r.number }} - {{ r.roomType?.name }} (₹{{ r.roomType?.basePrice }}/night)
                    </option>
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Check-in *</label>
                    <input v-model="form.checkIn" type="date" :min="today" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Check-out *</label>
                    <input v-model="form.checkOut" type="date" :min="form.checkIn || today" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  </div>
                </div>
              </div>
            </div>

            <!-- Tour Booking Fields -->
            <div v-if="form.bookingType === 'tour'" class="border-t pt-4">
              <p class="text-sm font-medium text-gray-700 mb-3">Tour Details</p>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Select Tour *</label>
                  <select v-model="form.tourId" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="">Select a tour</option>
                    <option v-for="t in tours" :key="t.id" :value="t.id">
                      {{ t.name }} - {{ t.durationDays }}D/{{ t.durationNights }}N (₹{{ t.price }}/person)
                    </option>
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Travel Date *</label>
                    <input v-model="form.travelDate" type="date" :min="today" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">No. of People *</label>
                    <input v-model.number="form.numberOfPeople" type="number" min="1" required class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment -->
            <div class="border-t pt-4">
              <p class="text-sm font-medium text-gray-700 mb-3">Payment (Optional)</p>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Payment Method</label>
                  <select v-model="form.paymentMethod" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="">No Payment</option>
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
                <div v-if="form.paymentMethod">
                  <label class="block text-xs text-gray-500 mb-1">Amount (₹)</label>
                  <input v-model.number="form.paymentAmount" type="number" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-xs text-gray-500 mb-1">Notes</label>
              <textarea v-model="form.notes" rows="2" class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Optional notes..."></textarea>
            </div>

            <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{{ error }}</div>
            <div v-if="success" class="bg-green-50 text-green-600 p-3 rounded-lg text-sm">{{ success }}</div>

            <div class="flex space-x-3">
              <button type="button" @click="closeModal" class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" :disabled="saving" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {{ saving ? 'Creating...' : 'Create Booking' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import apiClient from '@/services/api'

const today = new Date().toISOString().split('T')[0]
const activeTab = ref('room')
const filterStatus = ref('')
const allRoomBookings = ref<any[]>([])
const allTourBookings = ref<any[]>([])
const rooms = ref<any[]>([])
const tours = ref<any[]>([])
const showModal = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')

const defaultForm = {
  bookingType: 'room',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  roomId: '',
  checkIn: '',
  checkOut: '',
  tourId: '',
  travelDate: '',
  numberOfPeople: 1,
  paymentMethod: '',
  paymentAmount: 0,
  notes: ''
}
const form = ref({ ...defaultForm })

const roomBookings = computed(() => {
  if (!filterStatus.value) return allRoomBookings.value
  return allRoomBookings.value.filter(b => b.status === filterStatus.value)
})

const tourBookings = computed(() => {
  if (!filterStatus.value) return allTourBookings.value
  return allTourBookings.value.filter(b => b.status === filterStatus.value)
})

function formatDate(d: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    CHECKED_IN: 'bg-purple-100 text-purple-700',
    CHECKED_OUT: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

function openOfflineModal() {
  showModal.value = true
  error.value = ''
  success.value = ''
  form.value = { ...defaultForm }
}

function closeModal() {
  showModal.value = false
  error.value = ''
  success.value = ''
}

async function submitOfflineBooking() {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    const endpoint = form.value.bookingType === 'room' ? '/admin/bookings/rooms' : '/admin/bookings/tours'
    const payload = form.value.bookingType === 'room' ? {
      customerName: form.value.customerName,
      customerEmail: form.value.customerEmail,
      customerPhone: form.value.customerPhone,
      roomId: form.value.roomId,
      checkIn: form.value.checkIn,
      checkOut: form.value.checkOut,
      notes: form.value.notes,
      paymentMethod: form.value.paymentMethod || undefined,
      paymentAmount: form.value.paymentAmount || undefined,
    } : {
      customerName: form.value.customerName,
      customerEmail: form.value.customerEmail,
      customerPhone: form.value.customerPhone,
      tourId: form.value.tourId,
      travelDate: form.value.travelDate,
      numberOfPeople: form.value.numberOfPeople,
      notes: form.value.notes,
      paymentMethod: form.value.paymentMethod || undefined,
      paymentAmount: form.value.paymentAmount || undefined,
    }
    const res = await apiClient.post(endpoint, payload)
    success.value = `Booking created! Number: ${res.data.data.bookingNumber}`
    try {
      await Promise.all([fetchRoomBookings(), fetchTourBookings()])
    } catch (_) { /* ignore refresh errors */ }
    setTimeout(closeModal, 2000)
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to create booking'
  } finally {
    saving.value = false
  }
}

async function checkIn(id: string) {
  if (!confirm('Check in this booking?')) return
  await apiClient.put(`/bookings/${id}/check-in`)
  await fetchRoomBookings()
}

async function checkOut(id: string) {
  if (!confirm('Check out this booking?')) return
  await apiClient.put(`/bookings/${id}/check-out`)
  await fetchRoomBookings()
}

async function cancelBooking(id: string) {
  if (!confirm('Cancel this booking?')) return
  await apiClient.put(`/bookings/${id}/cancel`)
  await fetchRoomBookings()
}

async function confirmTour(id: string) {
  if (!confirm('Confirm this tour booking?')) return
  await apiClient.put(`/tour-bookings/${id}/confirm`)
  await fetchTourBookings()
}

async function completeTour(id: string) {
  if (!confirm('Mark as completed?')) return
  await apiClient.put(`/tour-bookings/${id}/complete`)
  await fetchTourBookings()
}

async function cancelTourBooking(id: string) {
  if (!confirm('Cancel this tour booking?')) return
  await apiClient.put(`/tour-bookings/${id}/cancel`)
  await fetchTourBookings()
}

async function fetchRoomBookings() {
  const res = await apiClient.get('/bookings', { params: { limit: 100 } })
  allRoomBookings.value = res.data.data?.bookings || res.data.data || []
}

async function fetchTourBookings() {
  const res = await apiClient.get('/tour-bookings', { params: { limit: 100 } })
  allTourBookings.value = res.data.data?.bookings || res.data.data || []
}

async function fetchRooms() {
  const res = await apiClient.get('/hotel/rooms')
  const data = res.data.data
  rooms.value = data?.rooms || data || []
}

async function fetchTours() {
  const res = await apiClient.get('/tours/tours')
  const data = res.data.data
  tours.value = data?.tours || data || []
}

onMounted(async () => {
  await Promise.all([fetchRoomBookings(), fetchTourBookings(), fetchRooms(), fetchTours()])
})
</script>
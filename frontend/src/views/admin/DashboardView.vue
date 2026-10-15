<template>
  <AdminLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

      <div v-if="loading" class="text-center py-12 text-gray-500">Loading dashboard...</div>

      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-500 text-sm">Total Rooms</p>
            <p class="text-3xl font-bold">{{ overview?.rooms?.total || 0 }}</p>
            <p class="text-xs text-green-600 mt-1">{{ overview?.rooms?.available || 0 }} available</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-500 text-sm">Total Tours</p>
            <p class="text-3xl font-bold">{{ overview?.tours?.total || 0 }}</p>
            <p class="text-xs text-green-600 mt-1">{{ overview?.tours?.featured || 0 }} featured</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-500 text-sm">Total Bookings</p>
            <p class="text-3xl font-bold">{{ overview?.bookings?.total || 0 }}</p>
            <p class="text-xs text-blue-600 mt-1">{{ overview?.bookings?.thisMonth || 0 }} this month</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <p class="text-gray-500 text-sm">Total Revenue</p>
            <p class="text-3xl font-bold">₹{{ formatNumber(overview?.revenue?.total || 0) }}</p>
            <p class="text-xs text-blue-600 mt-1">₹{{ formatNumber(overview?.revenue?.thisMonth || 0) }} this month</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Revenue ({{ currentYear }})</h2>
            <div class="space-y-2">
              <div v-for="m in revenue" :key="m.month" class="flex items-center text-sm">
                <span class="w-8 text-gray-500">{{ m.month }}</span>
                <div class="flex-1 mx-3 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 rounded-full" :style="{ width: revenueWidth(m.totalRevenue) + '%' }"></div>
                </div>
                <span class="w-20 text-right font-medium">₹{{ formatNumber(m.totalRevenue) }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Recent Bookings</h2>
            <div class="space-y-3">
              <div v-for="b in recentBookings" :key="b.id" class="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                <div>
                  <p class="font-medium">{{ b.customer?.name || 'Unknown' }}</p>
                  <p class="text-gray-500 text-xs">{{ b.bookingNumber }}</p>
                </div>
                <div class="text-right">
                  <span class="inline-block px-2 py-1 rounded text-xs font-medium"
                    :class="statusClass(b.status)">{{ b.status }}</span>
                  <p class="text-gray-500 text-xs mt-1">₹{{ formatNumber(b.totalAmount) }}</p>
                </div>
              </div>
              <p v-if="!recentBookings?.length" class="text-gray-400 text-sm text-center py-4">No bookings yet</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Booking Summary</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <p class="text-2xl font-bold text-blue-600">{{ bookingSummary?.roomBookings?.total || 0 }}</p>
                <p class="text-sm text-gray-600">Room Bookings</p>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <p class="text-2xl font-bold text-green-600">{{ bookingSummary?.tourBookings?.total || 0 }}</p>
                <p class="text-sm text-gray-600">Tour Bookings</p>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <p class="text-2xl font-bold text-purple-600">₹{{ formatNumber(bookingSummary?.roomBookings?.totalRevenue || 0) }}</p>
                <p class="text-sm text-gray-600">Room Revenue</p>
              </div>
              <div class="text-center p-4 bg-orange-50 rounded-lg">
                <p class="text-2xl font-bold text-orange-600">₹{{ formatNumber(bookingSummary?.tourBookings?.totalRevenue || 0) }}</p>
                <p class="text-sm text-gray-600">Tour Revenue</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold mb-4">Top Tours</h2>
            <div class="space-y-3">
              <div v-for="(t, i) in topTours" :key="t.id" class="flex items-center justify-between text-sm">
                <div class="flex items-center space-x-3">
                  <span class="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">{{ i + 1 }}</span>
                  <div>
                    <p class="font-medium">{{ t.name }}</p>
                    <p class="text-gray-500 text-xs">{{ t.category }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-medium">{{ t.totalBookings }} bookings</p>
                  <p class="text-gray-500 text-xs">₹{{ formatNumber(t.totalRevenue) }}</p>
                </div>
              </div>
              <p v-if="!topTours?.length" class="text-gray-400 text-sm text-center py-4">No tour data yet</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import apiClient from '@/services/api'

const currentYear = new Date().getFullYear()
const loading = ref(true)
const overview = ref<any>(null)
const revenue = ref<any[]>([])
const recentBookings = ref<any[]>([])
const bookingSummary = ref<any>(null)
const topTours = ref<any[]>([])

function formatNumber(n: number) {
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

function revenueWidth(val: number) {
  const max = Math.max(...revenue.value.map(r => r.totalRevenue), 1)
  return (val / max) * 100
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
    CHECKED_IN: 'bg-purple-100 text-purple-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

onMounted(async () => {
  try {
    const [overviewRes, revenueRes, recentRes, summaryRes, topRes] = await Promise.all([
      apiClient.get('/dashboard/overview'),
      apiClient.get('/dashboard/revenue', { params: { year: currentYear } }),
      apiClient.get('/dashboard/recent-bookings', { params: { limit: 8 } }),
      apiClient.get('/dashboard/booking-summary'),
      apiClient.get('/dashboard/top-tours', { params: { limit: 5 } }),
    ])
    overview.value = overviewRes.data.data
    revenue.value = revenueRes.data.data
    recentBookings.value = recentRes.data.data
    bookingSummary.value = summaryRes.data.data
    topTours.value = topRes.data.data
  } catch (err) {
    console.error('Dashboard load error:', err)
  } finally {
    loading.value = false
  }
})
</script>
<template>
  <div class="min-h-screen bg-gray-100 flex">
    <aside class="w-64 bg-gray-900 text-white flex flex-col">
      <div class="p-4 border-b border-gray-800">
        <router-link to="/admin" class="text-xl font-bold text-blue-400">Hotel & Tours</router-link>
        <p class="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg transition"
          :class="$route.path === item.path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'">
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-800">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
            {{ authStore.user?.name?.charAt(0) || 'A' }}
          </div>
          <div class="text-sm">
            <p class="font-medium">{{ authStore.user?.name }}</p>
            <p class="text-gray-400 text-xs">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <router-link to="/" class="flex-1 text-center text-xs bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded transition">
            View Site
          </router-link>
          <button @click="handleLogout" class="flex-1 text-xs bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition">
            Logout
          </button>
        </div>
      </div>
    </aside>

    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const IconDashboard = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
])
const IconRoom = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' })
])
const IconTour = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
])
const IconBooking = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })
])
const IconCustomer = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })
])

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: IconDashboard },
  { path: '/admin/rooms', label: 'Rooms', icon: IconRoom },
  { path: '/admin/tours', label: 'Tours', icon: IconTour },
  { path: '/admin/bookings', label: 'Bookings', icon: IconBooking },
  { path: '/admin/customers', label: 'Users', icon: IconCustomer },
]

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
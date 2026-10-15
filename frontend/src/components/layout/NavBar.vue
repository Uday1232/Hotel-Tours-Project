<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <router-link to="/" class="text-2xl font-bold text-blue-600">
          Hotel & Tours
        </router-link>

        <div class="hidden md:flex space-x-8">
          <router-link to="/" class="text-gray-700 hover:text-blue-600 transition">Home</router-link>
          <router-link to="/rooms" class="text-gray-700 hover:text-blue-600 transition">Rooms</router-link>
          <router-link to="/tours" class="text-gray-700 hover:text-blue-600 transition">Tours</router-link>
          <router-link to="/contact" class="text-gray-700 hover:text-blue-600 transition">Contact</router-link>
        </div>

        <div class="hidden md:flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <router-link v-if="authStore.isAdmin" to="/admin" class="text-gray-700 hover:text-blue-600 transition">Admin</router-link>
            <span class="text-gray-700">{{ authStore.user?.name }}</span>
            <button @click="handleLogout" class="text-gray-700 hover:text-red-600 transition">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-gray-700 hover:text-blue-600 transition">Login</router-link>
            <router-link to="/register" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Register
            </router-link>
          </template>
        </div>

        <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="mobileMenuOpen" class="md:hidden pb-4">
        <router-link to="/" class="block py-2 text-gray-700 hover:text-blue-600" @click="mobileMenuOpen = false">Home</router-link>
        <router-link to="/rooms" class="block py-2 text-gray-700 hover:text-blue-600" @click="mobileMenuOpen = false">Rooms</router-link>
        <router-link to="/tours" class="block py-2 text-gray-700 hover:text-blue-600" @click="mobileMenuOpen = false">Tours</router-link>
        <router-link to="/contact" class="block py-2 text-gray-700 hover:text-blue-600" @click="mobileMenuOpen = false">Contact</router-link>
        <hr class="my-2">
        <template v-if="authStore.isAuthenticated">
          <router-link v-if="authStore.isAdmin" to="/admin" class="block py-2 text-gray-700 hover:text-blue-600" @click="mobileMenuOpen = false">Admin</router-link>
          <button @click="handleLogout" class="block py-2 text-left text-gray-700 hover:text-red-600 w-full">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="block py-2 text-gray-700 hover:text-blue-600" @click="mobileMenuOpen = false">Login</router-link>
          <router-link to="/register" class="block py-2 text-blue-600 font-semibold" @click="mobileMenuOpen = false">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

function handleLogout() {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}
</script>
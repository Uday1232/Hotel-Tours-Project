<template>
  <footer class="bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-4">Hotel & Tours</h3>
          <p class="text-gray-400">Your perfect stay and unforgettable journeys. Experience hospitality at its finest.</p>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-gray-400">
            <li><router-link to="/" class="hover:text-white transition">Home</router-link></li>
            <li><router-link to="/rooms" class="hover:text-white transition">Rooms</router-link></li>
            <li><router-link to="/tours" class="hover:text-white transition">Tours</router-link></li>
            <li><router-link to="/contact" class="hover:text-white transition">Contact</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-4">Tour Categories</h4>
          <ul class="space-y-2 text-gray-400">
            <li><router-link to="/tours?category=ADVENTURE" class="hover:text-white transition">Adventure</router-link></li>
            <li><router-link to="/tours?category=CULTURAL" class="hover:text-white transition">Cultural</router-link></li>
            <li><router-link to="/tours?category=BEACH" class="hover:text-white transition">Beach</router-link></li>
            <li><router-link to="/tours?category=WILDLIFE" class="hover:text-white transition">Wildlife</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-4">Contact Us</h4>
          <ul class="space-y-2 text-gray-400">
            <li class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>123 Hotel Street, City</span>
            </li>
            <li class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span>+91 99999 99999</span>
            </li>
            <li class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span>info@hoteltours.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} Hotel & Tours. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
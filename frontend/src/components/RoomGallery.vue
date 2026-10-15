<template>
  <div class="space-y-4">
    <div class="relative h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center">
        <svg class="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
      <div class="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>

    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="(image, index) in images"
        :key="image.id"
        @click="currentIndex = index"
        class="h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded overflow-hidden border-2 transition"
        :class="currentIndex === index ? 'border-blue-500' : 'border-transparent hover:border-gray-300'"
      >
        <div class="w-full h-full flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
      </button>
    </div>

    <p class="text-gray-600 text-sm">{{ images[currentIndex]?.caption }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Image {
  id: string
  url: string
  caption: string
}

defineProps<{ images: Image[] }>()

const currentIndex = ref(0)
</script>
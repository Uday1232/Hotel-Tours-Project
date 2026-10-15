<template>
  <div>
    <div v-if="previewUrl || modelValue" class="mb-3">
      <div class="relative inline-block">
        <img :src="previewUrl || modelValue" class="h-32 w-32 object-cover rounded-lg border" />
        <button @click="clearImage" type="button"
          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">
          &times;
        </button>
      </div>
    </div>

    <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer"
      @click="openPicker" @dragover.prevent @drop.prevent="handleDrop">
      <svg class="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-sm text-gray-500">Click or drag image here</p>
      <p class="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF — Max 5MB</p>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFile" />

    <div v-if="uploading" class="mt-2 text-sm text-blue-600">Uploading...</div>
    <div v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import apiClient from '@/services/api'

const props = defineProps<{
  modelValue: string
  folder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const fileInput = ref<HTMLInputElement>()
const previewUrl = ref('')
const uploading = ref(false)
const error = ref('')

function openPicker() {
  fileInput.value?.click()
}

async function handleFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  await uploadFile(file)
}

function handleDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    uploadFile(file)
  }
}

async function uploadFile(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'File size must be less than 5MB'
    return
  }

  uploading.value = true
  error.value = ''

  const formData = new FormData()
  formData.append('image', file)
  if (props.folder) formData.append('folder', props.folder)

  try {
    const res = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const url = res.data.data.url
    previewUrl.value = URL.createObjectURL(file)
    emit('update:modelValue', url)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Upload failed'
  } finally {
    uploading.value = false
  }
}

function clearImage() {
  previewUrl.value = ''
  emit('update:modelValue', '')
  if (fileInput.value) fileInput.value.value = ''
}

watch(() => props.modelValue, (val) => {
  if (!val) previewUrl.value = ''
})
</script>
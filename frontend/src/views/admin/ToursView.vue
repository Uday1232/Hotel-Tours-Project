<template>
  <AdminLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Manage Tours</h1>
        <button @click="showCreateModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Add Tour
        </button>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b flex flex-col md:flex-row gap-3">
          <select v-model="filterCategory" class="px-3 py-2 border rounded-lg text-sm">
            <option value="">All Categories</option>
            <option value="ADVENTURE">Adventure</option>
            <option value="CULTURAL">Cultural</option>
            <option value="BEACH">Beach</option>
            <option value="WILDLIFE">Wildlife</option>
            <option value="PILGRIMAGE">Pilgrimage</option>
            <option value="HONEYMOON">Honeymoon</option>
            <option value="FAMILY">Family</option>
          </select>
        </div>

        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-4 py-3 font-medium">Image</th>
              <th class="text-left px-4 py-3 font-medium">Name</th>
              <th class="text-left px-4 py-3 font-medium">Category</th>
              <th class="text-left px-4 py-3 font-medium">Duration</th>
              <th class="text-left px-4 py-3 font-medium">Price</th>
              <th class="text-left px-4 py-3 font-medium">Featured</th>
              <th class="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tour in tours" :key="tour.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3">
                <img v-if="getTourPrimaryImage(tour)" :src="getTourPrimaryImage(tour)" class="h-10 w-14 rounded object-cover">
                <div v-else class="h-10 w-14 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No</div>
              </td>
              <td class="px-4 py-3 font-medium">{{ tour.name }}</td>
              <td class="px-4 py-3"><span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{{ tour.category }}</span></td>
              <td class="px-4 py-3">{{ tour.durationDays }}D / {{ tour.durationNights }}N</td>
              <td class="px-4 py-3">₹{{ tour.price }}</td>
              <td class="px-4 py-3">{{ tour.isFeatured ? 'Yes' : 'No' }}</td>
              <td class="px-4 py-3 text-right space-x-2">
                <button @click="openImages(tour)" class="text-green-600 hover:underline text-xs">Images</button>
                <button @click="editTour(tour)" class="text-blue-600 hover:underline text-xs">Edit</button>
                <button @click="deleteTour(tour.id)" class="text-red-600 hover:underline text-xs">Delete</button>
              </td>
            </tr>
            <tr v-if="!tours.length">
              <td colspan="7" class="px-4 py-8 text-center text-gray-400">No tours found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || editingTour" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h2 class="text-lg font-semibold mb-4">{{ editingTour ? 'Edit Tour' : 'Add Tour' }}</h2>
          <form @submit.prevent="saveTour" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input v-model="form.name" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select v-model="form.category" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="ADVENTURE">Adventure</option>
                  <option value="CULTURAL">Cultural</option>
                  <option value="BEACH">Beach</option>
                  <option value="WILDLIFE">Wildlife</option>
                  <option value="PILGRIMAGE">Pilgrimage</option>
                  <option value="HONEYMOON">Honeymoon</option>
                  <option value="FAMILY">Family</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Price (per person)</label>
                <input v-model.number="form.price" type="number" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Days</label>
                <input v-model.number="form.durationDays" type="number" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nights</label>
                <input v-model.number="form.durationNights" type="number" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Max Group</label>
                <input v-model.number="form.maxGroupSize" type="number" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              </div>
            </div>
            <div class="flex items-center">
              <input v-model="form.isFeatured" type="checkbox" id="featured" class="mr-2">
              <label for="featured" class="text-sm text-gray-700">Featured tour</label>
            </div>
            <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
            <div class="flex space-x-3">
              <button type="button" @click="closeModal" class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit" :disabled="saving" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Images Modal -->
      <div v-if="imageModalTour" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="imageModalTour = null">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Images — {{ imageModalTour.name }}</h2>
            <button @click="imageModalTour = null" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          <div class="grid grid-cols-3 gap-3 mb-4">
            <div v-for="img in tourImages" :key="img.id" class="relative group">
              <img :src="img.url" class="h-32 w-full object-cover rounded-lg border">
              <div class="absolute top-1 left-1">
                <span v-if="img.isPrimary" class="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">Primary</span>
              </div>
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2 rounded-lg">
                <button v-if="!img.isPrimary" @click="setPrimary(img.id)" class="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600">Set Primary</button>
                <button @click="deleteImage(img.id)" class="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600">Delete</button>
              </div>
            </div>
          </div>

          <div class="border-t pt-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Upload New Image</p>
            <ImageUpload v-model="newImageUrl" folder="tours" />
            <button v-if="newImageUrl" @click="addImage" :disabled="savingImage"
              class="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm">
              {{ savingImage ? 'Saving...' : 'Add Image' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import apiClient from '@/services/api'

const allTours = ref<any[]>([])
const filterCategory = ref('')
const showCreateModal = ref(false)
const editingTour = ref<any>(null)
const saving = ref(false)
const error = ref('')

const imageModalTour = ref<any>(null)
const tourImages = ref<any[]>([])
const newImageUrl = ref('')
const savingImage = ref(false)

const defaultForm = { name: '', description: '', category: 'ADVENTURE', price: 0, durationDays: 1, durationNights: 0, maxGroupSize: 10, isFeatured: false }
const form = ref({ ...defaultForm })

const tours = computed(() => {
  if (!filterCategory.value) return allTours.value
  return allTours.value.filter(t => t.category === filterCategory.value)
})

function getTourPrimaryImage(tour: any) {
  const primary = tour.images?.find((i: any) => i.isPrimary)
  return primary?.url || tour.images?.[0]?.url || null
}

function editTour(tour: any) {
  editingTour.value = tour
  form.value = {
    name: tour.name, description: tour.description || '', category: tour.category,
    price: tour.price, durationDays: tour.durationDays, durationNights: tour.durationNights,
    maxGroupSize: tour.maxGroupSize, isFeatured: tour.isFeatured
  }
}

function closeModal() {
  showCreateModal.value = false
  editingTour.value = null
  form.value = { ...defaultForm }
  error.value = ''
}

async function saveTour() {
  saving.value = true
  error.value = ''
  try {
    if (editingTour.value) {
      await apiClient.put(`/tours/tours/${editingTour.value.id}`, form.value)
    } else {
      await apiClient.post('/tours/tours', form.value)
    }
    await fetchTours()
    closeModal()
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to save tour'
  } finally {
    saving.value = false
  }
}

async function deleteTour(id: string) {
  if (!confirm('Delete this tour?')) return
  try {
    await apiClient.delete(`/tours/tours/${id}`)
    await fetchTours()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to delete tour')
  }
}

async function openImages(tour: any) {
  imageModalTour.value = tour
  newImageUrl.value = ''
  try {
    const res = await apiClient.get(`/tours/tours/${tour.id}/images`)
    tourImages.value = res.data.data || []
  } catch { tourImages.value = [] }
}

async function addImage() {
  if (!newImageUrl.value || !imageModalTour.value) return
  savingImage.value = true
  try {
    await apiClient.post(`/tours/tours/${imageModalTour.value.id}/images`, {
      tourId: imageModalTour.value.id,
      url: newImageUrl.value,
      isPrimary: tourImages.value.length === 0,
    })
    newImageUrl.value = ''
    await openImages(imageModalTour.value)
    await fetchTours()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to add image')
  } finally {
    savingImage.value = false
  }
}

async function setPrimary(imageId: string) {
  try {
    await apiClient.put(`/tours/tour-images/${imageId}/primary`)
    await openImages(imageModalTour.value)
    await fetchTours()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to set primary')
  }
}

async function deleteImage(imageId: string) {
  if (!confirm('Delete this image?')) return
  try {
    await apiClient.delete(`/tours/tour-images/${imageId}`)
    await openImages(imageModalTour.value)
    await fetchTours()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to delete image')
  }
}

async function fetchTours() {
  const res = await apiClient.get('/tours/tours')
  const data = res.data.data
  allTours.value = data.tours || data
}

onMounted(fetchTours)
</script>
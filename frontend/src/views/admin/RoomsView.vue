<template>
  <AdminLayout>
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Manage Rooms</h1>
        <button @click="showCreateModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Add Room
        </button>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b flex flex-col md:flex-row gap-3">
          <select v-model="filterType" class="px-3 py-2 border rounded-lg text-sm">
            <option value="">All Types</option>
            <option v-for="t in roomTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
          <select v-model="filterStatus" class="px-3 py-2 border rounded-lg text-sm">
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-4 py-3 font-medium">Image</th>
              <th class="text-left px-4 py-3 font-medium">Room #</th>
              <th class="text-left px-4 py-3 font-medium">Type</th>
              <th class="text-left px-4 py-3 font-medium">Floor</th>
              <th class="text-left px-4 py-3 font-medium">Price</th>
              <th class="text-left px-4 py-3 font-medium">Status</th>
              <th class="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in rooms" :key="room.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3">
                <img v-if="getRoomPrimaryImage(room)" :src="getRoomPrimaryImage(room)" class="h-10 w-10 rounded object-cover">
                <div v-else class="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No</div>
              </td>
              <td class="px-4 py-3 font-medium">{{ room.number }}</td>
              <td class="px-4 py-3">{{ room.roomType?.name || '-' }}</td>
              <td class="px-4 py-3">{{ room.floor }}</td>
              <td class="px-4 py-3">₹{{ room.roomType?.basePrice || 0 }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded text-xs font-medium" :class="statusClass(room.status)">{{ room.status }}</span>
              </td>
              <td class="px-4 py-3 text-right space-x-2">
                <button @click="openImages(room)" class="text-green-600 hover:underline text-xs">Images</button>
                <button @click="editRoom(room)" class="text-blue-600 hover:underline text-xs">Edit</button>
                <button @click="deleteRoom(room.id)" class="text-red-600 hover:underline text-xs">Delete</button>
              </td>
            </tr>
            <tr v-if="!rooms.length">
              <td colspan="7" class="px-4 py-8 text-center text-gray-400">No rooms found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || editingRoom" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closeModal">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-lg font-semibold mb-4">{{ editingRoom ? 'Edit Room' : 'Add Room' }}</h2>
          <form @submit.prevent="saveRoom" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <input v-model="form.number" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select v-model="form.roomTypeId" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Select type</option>
                <option v-for="t in roomTypes" :key="t.id" :value="t.id">{{ t.name }} — ₹{{ t.basePrice }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <input v-model.number="form.floor" type="number" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="form.status" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
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
      <div v-if="imageModalRoom" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="imageModalRoom = null">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Images — Room {{ imageModalRoom.number }}</h2>
            <button @click="imageModalRoom = null" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>

          <div class="grid grid-cols-3 gap-3 mb-4">
            <div v-for="img in roomImages" :key="img.id" class="relative group">
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
            <ImageUpload v-model="newImageUrl" folder="rooms" />
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

const allRooms = ref<any[]>([])
const roomTypes = ref<any[]>([])
const filterType = ref('')
const filterStatus = ref('')
const showCreateModal = ref(false)
const editingRoom = ref<any>(null)
const saving = ref(false)
const error = ref('')

const imageModalRoom = ref<any>(null)
const roomImages = ref<any[]>([])
const newImageUrl = ref('')
const savingImage = ref(false)

const form = ref({ number: '', roomTypeId: '', floor: 1, status: 'AVAILABLE' })

const rooms = computed(() => {
  let result = allRooms.value
  if (filterType.value) result = result.filter(r => r.roomTypeId === filterType.value)
  if (filterStatus.value) result = result.filter(r => r.status === filterStatus.value)
  return result
})

function getRoomPrimaryImage(room: any) {
  const primary = room.images?.find((i: any) => i.isPrimary)
  return primary?.url || room.images?.[0]?.url || null
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    AVAILABLE: 'bg-green-100 text-green-700',
    OCCUPIED: 'bg-red-100 text-red-700',
    MAINTENANCE: 'bg-yellow-100 text-yellow-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

function editRoom(room: any) {
  editingRoom.value = room
  form.value = { number: room.number, roomTypeId: room.roomTypeId, floor: room.floor, status: room.status }
}

function closeModal() {
  showCreateModal.value = false
  editingRoom.value = null
  form.value = { number: '', roomTypeId: '', floor: 1, status: 'AVAILABLE' }
  error.value = ''
}

async function saveRoom() {
  saving.value = true
  error.value = ''
  try {
    if (editingRoom.value) {
      await apiClient.put(`/hotel/rooms/${editingRoom.value.id}`, form.value)
    } else {
      await apiClient.post('/hotel/rooms', form.value)
    }
    await fetchRooms()
    closeModal()
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to save room'
  } finally {
    saving.value = false
  }
}

async function deleteRoom(id: string) {
  if (!confirm('Delete this room?')) return
  try {
    await apiClient.delete(`/hotel/rooms/${id}`)
    await fetchRooms()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to delete room')
  }
}

async function openImages(room: any) {
  imageModalRoom.value = room
  newImageUrl.value = ''
  try {
    const res = await apiClient.get(`/hotel/rooms/${room.id}/images`)
    roomImages.value = res.data.data || []
  } catch { roomImages.value = [] }
}

async function addImage() {
  if (!newImageUrl.value || !imageModalRoom.value) return
  savingImage.value = true
  try {
    await apiClient.post(`/hotel/rooms/${imageModalRoom.value.id}/images`, {
      roomId: imageModalRoom.value.id,
      url: newImageUrl.value,
      isPrimary: roomImages.value.length === 0,
    })
    newImageUrl.value = ''
    await openImages(imageModalRoom.value)
    await fetchRooms()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to add image')
  } finally {
    savingImage.value = false
  }
}

async function setPrimary(imageId: string) {
  try {
    await apiClient.put(`/hotel/images/${imageId}/primary`)
    await openImages(imageModalRoom.value)
    await fetchRooms()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to set primary')
  }
}

async function deleteImage(imageId: string) {
  if (!confirm('Delete this image?')) return
  try {
    await apiClient.delete(`/hotel/images/${imageId}`)
    await openImages(imageModalRoom.value)
    await fetchRooms()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to delete image')
  }
}

async function fetchRooms() {
  const res = await apiClient.get('/hotel/rooms')
  const data = res.data.data
  allRooms.value = data.rooms || data
}

async function fetchRoomTypes() {
  const res = await apiClient.get('/hotel/room-types')
  roomTypes.value = res.data.data
}

onMounted(async () => {
  await Promise.all([fetchRooms(), fetchRoomTypes()])
})
</script>
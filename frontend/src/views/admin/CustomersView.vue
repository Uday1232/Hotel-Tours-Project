<template>
  <AdminLayout>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Users</h1>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b">
          <input v-model="search" @input="debouncedFetch" placeholder="Search by name, email, or phone..."
            class="w-full md:w-96 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
        </div>

        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-left px-4 py-3 font-medium">Name</th>
              <th class="text-left px-4 py-3 font-medium">Email</th>
              <th class="text-left px-4 py-3 font-medium">Phone</th>
              <th class="text-left px-4 py-3 font-medium">Role</th>
              <th class="text-left px-4 py-3 font-medium">Bookings</th>
              <th class="text-left px-4 py-3 font-medium">Reviews</th>
              <th class="text-left px-4 py-3 font-medium">Status</th>
              <th class="text-left px-4 py-3 font-medium">Joined</th>
              <th class="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-t hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ user.name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ user.email }}</td>
              <td class="px-4 py-3 text-gray-600">{{ user.phone || '-' }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded text-xs font-medium"
                  :class="user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3">{{ user._count?.bookings || 0 }}</td>
              <td class="px-4 py-3">{{ user._count?.reviews || 0 }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded text-xs font-medium"
                  :class="user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs">{{ formatDate(user.createdAt) }}</td>
              <td class="px-4 py-3 text-right space-x-2">
                <button @click="viewUser(user)" class="text-blue-600 hover:underline text-xs">View</button>
                <button @click="toggleStatus(user)" class="text-yellow-600 hover:underline text-xs">
                  {{ user.isActive ? 'Deactivate' : 'Activate' }}
                </button>
                <button v-if="user.role !== 'ADMIN'" @click="makeAdmin(user)" class="text-purple-600 hover:underline text-xs">Make Admin</button>
              </td>
            </tr>
            <tr v-if="!users.length && !loading">
              <td colspan="9" class="px-4 py-8 text-center text-gray-400">No users found</td>
            </tr>
          </tbody>
        </table>

        <div class="p-4 border-t flex justify-between items-center text-sm text-gray-500">
          <span>Showing {{ users.length }} of {{ total }} users</span>
          <div class="space-x-2">
            <button @click="prevPage" :disabled="page <= 1" class="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
            <span>Page {{ page }}</span>
            <button @click="nextPage" :disabled="page >= totalPages" class="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      <div v-if="selectedUser" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="selectedUser = null">
        <div class="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">User Details</h2>
            <button @click="selectedUser = null" class="text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between"><span class="text-gray-500">Name</span><span class="font-medium">{{ selectedUser.name }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Email</span><span>{{ selectedUser.email }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Phone</span><span>{{ selectedUser.phone || '-' }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Role</span><span>{{ selectedUser.role }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Status</span><span>{{ selectedUser.isActive ? 'Active' : 'Inactive' }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Joined</span><span>{{ formatDate(selectedUser.createdAt) }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">Total Bookings</span><span>{{ selectedUser._count?.bookings || 0 }}</span></div>
          </div>
          <div v-if="selectedUser.bookings?.length" class="mt-4">
            <h3 class="font-medium mb-2">Recent Bookings</h3>
            <div class="space-y-2">
              <div v-for="b in selectedUser.bookings" :key="b.id" class="bg-gray-50 p-3 rounded text-sm">
                <div class="flex justify-between">
                  <span class="font-medium">{{ b.bookingNumber }}</span>
                  <span class="px-2 py-0.5 rounded text-xs" :class="statusClass(b.status)">{{ b.status }}</span>
                </div>
                <p class="text-gray-500 text-xs mt-1">₹{{ b.totalAmount }} • {{ formatDate(b.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import apiClient from '@/services/api'

const users = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const page = ref(1)
const limit = 20
const total = ref(0)
const totalPages = ref(1)
const selectedUser = ref<any>(null)
let debounceTimer: ReturnType<typeof setTimeout>

function formatDate(d: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchUsers() }, 300)
}

async function fetchUsers() {
  loading.value = true
  try {
    const res = await apiClient.get('/admin/users', { params: { page: page.value, limit, search: search.value || undefined } })
    users.value = res.data.data.users
    total.value = res.data.data.pagination.total
    totalPages.value = res.data.data.pagination.totalPages
  } catch (err) {
    console.error('Failed to fetch users:', err)
  } finally {
    loading.value = false
  }
}

async function viewUser(user: any) {
  try {
    const res = await apiClient.get(`/admin/users/${user.id}`)
    selectedUser.value = res.data.data
  } catch { selectedUser.value = user }
}

async function toggleStatus(user: any) {
  if (!confirm(`${user.isActive ? 'Deactivate' : 'Activate'} ${user.name}?`)) return
  try {
    await apiClient.patch(`/admin/users/${user.id}/toggle-status`)
    await fetchUsers()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to update user')
  }
}

async function makeAdmin(user: any) {
  if (!confirm(`Make ${user.name} an admin?`)) return
  try {
    await apiClient.patch(`/admin/users/${user.id}/role`, { role: 'ADMIN' })
    await fetchUsers()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to update role')
  }
}

function prevPage() { if (page.value > 1) { page.value--; fetchUsers() } }
function nextPage() { if (page.value < totalPages.value) { page.value++; fetchUsers() } }

onMounted(fetchUsers)
</script>
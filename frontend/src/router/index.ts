import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/public/HomeView.vue'),
    meta: { title: 'Home' }
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: () => import('@/views/public/RoomListView.vue'),
    meta: { title: 'Hotel Rooms' }
  },
  {
    path: '/rooms/:id',
    name: 'RoomDetail',
    component: () => import('@/views/public/RoomDetailView.vue'),
    meta: { title: 'Room Details' }
  },
  {
    path: '/booking',
    name: 'Booking',
    component: () => import('@/views/public/BookingView.vue'),
    meta: { title: 'Book a Room' }
  },
  {
    path: '/tours',
    name: 'Tours',
    component: () => import('@/views/public/ToursView.vue'),
    meta: { title: 'Tour Packages' }
  },
  {
    path: '/tours/:id',
    name: 'TourDetail',
    component: () => import('@/views/public/TourDetailView.vue'),
    meta: { title: 'Tour Details' }
  },
  {
    path: '/tour-booking',
    name: 'TourBooking',
    component: () => import('@/views/public/TourBookingView.vue'),
    meta: { title: 'Book a Tour' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/public/ContactView.vue'),
    meta: { title: 'Contact Us' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { title: 'Register' }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/DashboardView.vue'),
    meta: { title: 'Admin Dashboard', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/rooms',
    name: 'AdminRooms',
    component: () => import('@/views/admin/RoomsView.vue'),
    meta: { title: 'Manage Rooms', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/tours',
    name: 'AdminTours',
    component: () => import('@/views/admin/ToursView.vue'),
    meta: { title: 'Manage Tours', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/bookings',
    name: 'AdminBookings',
    component: () => import('@/views/admin/BookingsView.vue'),
    meta: { title: 'Manage Bookings', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/customers',
    name: 'AdminCustomers',
    component: () => import('@/views/admin/CustomersView.vue'),
    meta: { title: 'Manage Customers', requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || 'Home'} | Hotel & Tours`

  const token = localStorage.getItem('auth_token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  if (to.meta.requiresAdmin && user?.role !== 'ADMIN') {
    return next('/')
  }

  next()
})

export default router
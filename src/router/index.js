import HomePage from '@/views/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomePage
    },
    {
      path: '/room/:id',
      component: () => import('@/views/RoomPages.vue')
    },
    { path: '/login', component: () => import('@/views/LoginPage.vue') }
  ]
})

export default router

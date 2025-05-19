import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
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
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage }
  ]
})

export default router

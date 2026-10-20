import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WeatherView from '@/views/WeatherView.vue'
import MoonView from '@/views/MoonView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/weather',
      name: 'weather',
      component: WeatherView
    },
    {
      path: '/moon',
      name: 'moon',
      component: MoonView
    }
  ],
})

export default router

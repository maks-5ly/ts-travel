import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { UserOutlined, CarOutlined } from '@ant-design/icons-vue'
import UserView from '@/views/UserView.vue'
export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    label: 'Home',
    icon: CarOutlined
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/UserView.vue'),
    label: 'Users',
    icon: UserOutlined
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (About.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import('../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

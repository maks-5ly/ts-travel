import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { UserOutlined, CarOutlined } from '@ant-design/icons-vue'
import { RoleEnum } from '@/types'
import { useAuth } from '@/composables/useAuth';
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
    icon: UserOutlined,
    meta: {
      role: RoleEnum.ADMIN
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useAuth()
  if (!to.meta.role) {
    return next()
  }

  if (to.meta.role === RoleEnum.ADMIN && !store.isAdmin.value) {
    return next({ name: 'home' })
  }

  if (to.meta.role === RoleEnum.EDITOR && !store.isEditor.value) {
    return next({ name: 'home' })
  }
})

export default router

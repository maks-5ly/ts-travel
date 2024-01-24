import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { UserOutlined, CarOutlined } from '@ant-design/icons-vue'
import { RoleEnum } from '@/types'
import { LocalstorageService } from '@/service/localstorage'

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
  const user = LocalstorageService.getUser()

  if (!to.meta.role) {
    return next()
  }

  if (to.meta.role === RoleEnum.ADMIN && !user?.roles.find(role => role.name === RoleEnum.ADMIN)) {
    return next({ name: 'home' })
  }

  if (
    to.meta.role === RoleEnum.EDITOR && user?.roles.some(
      role => role.name === RoleEnum.ADMIN || role.name === RoleEnum.EDITOR
    )
  ) {
    return next({ name: 'home' })
  }

  return next()
})

export default router

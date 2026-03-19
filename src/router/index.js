import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { isAuthenticated, isAuthorizedUser } from '../services/catalystAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/add-user',
      name: 'add-user',
      component: () => import('../views/AddUserView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to) => {
  if (to.meta.public) {
    return true
  }

  const loggedIn = await isAuthenticated()

  if (!loggedIn) {
    return { name: 'login', query: { reason: 'auth' } }
  }

  const allowed = await isAuthorizedUser('Users')

  if (!allowed) {
    return { name: 'login', query: { reason: 'not-registered' } }
  }

  return true
})

export default router

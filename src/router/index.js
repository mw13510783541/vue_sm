import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/views/home/Home'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to)
  if (to.path === '/login') return next()
  const getToken = sessionStorage.getItem('token')
  if (!getToken) return next('/login')
  next()
})

export default router

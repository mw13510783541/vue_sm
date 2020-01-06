import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/views/home/Home'
import Welcome from '@/components/Welcome'
import Users from '@/views/users/Users'
import Rights from '@/views/rights/Rights'
import Roles from '@/views/rights/Roles'
import Cate from '@/views/goods/Cate'

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
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: Welcome
      },
      {
        path: '/users',
        name: 'users',
        component: Users
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/categories',
        name: 'categories',
        component: Cate
      }
    ]
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

import { createRouter, createWebHashHistory } from 'vue-router'

// 路由组件
import Index from '@/view/Index.vue'
import ShoppingCart from '@/view/ShoppingCart.vue'
import User from '@/view/User.vue'
import Login from '@/view/Login.vue'
import Register from '@/view/Register.vue'
import Order from '@/view/Order.vue'

const routes = [
  { path: '/', component: Index },
  { path: '/jumpShoppingCart', component: ShoppingCart },
  { path: '/jumpUser', component: User },
  { path: '/jumpLogin', component: Login },
  { path: '/jumpRegister', component: Register },
  { path: '/jumpOrder', component: Order }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  document.title = '手机商城(mobile terminal)'
  if (
    to.path === '/' ||
    to.path === '/jumpLogin' ||
    to.path === '/jumpRegister' ||
    token
  ) {
    next()
  } else {
    next('/jumpLogin')
  }
})

export default router

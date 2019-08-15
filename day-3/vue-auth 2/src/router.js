import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)
export const authRoutes = [ // 权限
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart'),
    children: [
      {
        path: 'cart-list',
        name: 'cart-list',
        component: () => import('@/views/CartList'),
        children: [
          {
            path: 'lottery',
            name: 'lottery',
            component: () => import('@/views/Lottery'),
          },
          {
            path: 'product',
            name: 'product',
            component: () => import('@/views/Product'),
          },
        ],
      },
    ],
  },
];
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path:'*',
      component:{
        render:h=>h('h1',{},'Not Found')
      }
    }
  ]
})

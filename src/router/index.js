import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/home/welcome',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: 'welcome',
        naem: 'welcome',
        component: () => import('@/components/welcome.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/components/Users.vue')
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import('@/components/Rights.vue')
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/components/goods.vue')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/components/orders.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/components/reports.vue')
      }, {
        path: 'roles',
        name: 'roles',
        component: () => import('@/components/roles.vue')
      },
      {
        path: 'params',
        name: 'params',
        component: () => import('@/components/params.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/components/categories.vue')
      }
    ]

  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    let token = sessionStorage.getItem('token');
    if (token) {
      next();
    } else {
      next('/login')
    }
  } else {
    next()
  }
})
export default router

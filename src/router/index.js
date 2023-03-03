import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/test',
      component: () => import('@/views/Test.vue')
    },
    {
      path: '/home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/pub',
      component: () => import('@/views/Pub.vue')
    },
    {
      path: '/page',
      component: () => import('@/views/Page.vue')
    }
  ]
})

export default router

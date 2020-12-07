import Vue from 'vue'
import App from './App.vue'
import VueRouter from './vue-router'

import PageA from '@/components/A'
import PageB from '@/components/B'
import PageBA from '@/components/b-a'
import PageBB from '@/components/b-b'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'pageA',
    component: PageA,
  },
  {
    path: '/b',
    name: 'pageA',
    component: PageB,
    children: [
      {
        path: 'b-a',
        name: 'pageBA',
        component: PageBA,
      },
      {
        path: 'b-b',
        name: 'pageBB',
        component: PageBB,
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    console.log(to)
    next()
  }, 1000)
})

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    console.log(from)
    next()
  }, 1000)
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

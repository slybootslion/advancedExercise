import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/custom-directives',
    name: 'custom-directives',
    component: () => import(/* webpackChunkName: "custom-directives" */ '../views/CustomDirectives/CustomDirectives')
  },
  {
    path: '/transition',
    name: 'transition-comp',
    component: () => import(/* webpackChunkName: "transition" */ '../views/Transition/Transition')
  }
]

const router = new VueRouter({
  routes
})

export default router

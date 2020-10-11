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
  },
  {
    path: '/event-bus',
    name: 'event-bus1',
    component: () => import(/* webpackChunkName: "eventBus" */ '../views/EventBus/EventBus')
  },
  {
    path: '/v-model',
    name: 'v-model',
    component: () => import(/* webpackChunkName: "eventBus" */ '../views/V-Model/V-Model')
  },
  {
    path: '/dispatch',
    name: 'dispatch',
    component: () => import(/* webpackChunkName: "DispatchBroadcast" */ '../views/DispatchBroadcast/Dispatch')
  },
  {
    path: '/provide-inject',
    name: 'provide-inject',
    component: () => import(/* webpackChunkName: "ProvideInject" */ '../views/ProvideInject/ProvideInject')
  },
  {
    path: '/lazyload',
    name: 'lazyload',
    component: () => import(/* webpackChunkName: "Lazyload" */ '../views/Lazyload/Lazyload')
  }
]

const router = new VueRouter({
  routes
})

export default router

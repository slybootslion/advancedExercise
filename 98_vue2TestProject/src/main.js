import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import api from './api'

import VueLazyload from './plugins/lazyload'

Vue.prototype.$bus = new Vue()
Vue.prototype.$dispatch = function (eventName, componentName, value) {
  let target = this.$parent
  while (target) {
    if (Array.isArray(componentName)) {
      if (componentName.includes(target.$options.name)) {
        target[eventName](value)
      }
    } else {
      if (target.$options.name === componentName) {
        target[eventName](value)
        break
      }
    }
    if (!target.$parent) return
    target = target.$parent
  }
}
Vue.prototype.$broadcast = function (eventName, componentName, value) {
  const children = this.$children

  const arr = componentName.split('>').map(item => item.trim())

  function broadcast (children) {
    if (arr.length > 1) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (arr.includes(child.$options.name)) {
          if (child[eventName]) {
            child[eventName](value)
            return
          } else {
            if (child.$children) {
              broadcast(child.$children)
            }
          }
        }
      }
    } else {
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child.$options.name === componentName) {
          child[eventName](value)
        } else {
          if (child.$children) broadcast(child.$children)
        }
      }
    }
  }

  broadcast(children)
}

Vue.prototype.$api = api

const loadingPic = 'https://static.uniformfox.com/images/slybootslion/%E6%9D%82%E4%B8%83%E6%9D%82%E5%85%AB/20200522/8fb9d2affc21dfce5ec7f3239c002799.png'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: loadingPic
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

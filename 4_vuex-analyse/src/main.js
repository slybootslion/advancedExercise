import Vue from 'vue'
import App from './App.vue'
import Vuex from './vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    name: 'baidu',
    age: 11,
  },
  getters: {
    pcAge(state) {
      return state.age + 20
    },
  },
  mutations: {},
  actions: {},
  modules: {},
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')

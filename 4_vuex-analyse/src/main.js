import Vue from 'vue'
import App from './App.vue'
import Vuex from './vuex'

Vue.use(Vuex)
let lock = false

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
  mutations: {
    changeName(state, value) {
      state.name = value
    },
    addAge(state, value) {
      state.age = state.age + value
    },
  },
  actions: {
    addAge({ commit }, payload) {
      if (lock) return
      lock = true
      setTimeout(function () {
        commit('addAge', payload)
        lock = false
      }, 1000)
    },
  },
  modules: {
    home: {
      namespace: true,
      state: {
        name: 'google',
        age: 20,
      }
    },
    company: {
      namespace: true,
      state: {
        name: 'baidu',
        age: 10,
      },
      getters: {
        getName(state) {
          return state.name + '牌搜索引擎'
        },
      },
      mutations: {
        changeName(state, value) {
          state.name = value
        },
        addAge(state, value) {
          state.age = state.age + value
        },
      },
      actions: {
        addAge({ commit }, payload) {
          if (lock) return
          lock = true
          setTimeout(function () {
            commit('company/addAge', payload)
            lock = false
          }, 1000)
        },
      },
    },
  },
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')

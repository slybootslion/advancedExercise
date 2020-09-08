import Vue from 'vue'
import App from './App.vue'
import zhuUi from './packages/index'

Vue.config.productionTip = false

Vue.use(zhuUi)

new Vue({
  render: h => h(App)
}).$mount('#app')

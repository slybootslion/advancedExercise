import { initState } from "./state";

function initMixin(Vue) {
  // Vue的初始化
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
    initState(vm)
  }
}

export { initMixin }

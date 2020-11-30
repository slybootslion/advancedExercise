import { initState } from './state'
import { compileToFunctions } from "./compiler/index";

function initMixin(Vue) {
  // Vue的初始化
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
    initState(vm)

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el)
    const vm = this
    const options = this.$options
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      options.render = compileToFunctions(template)
    }
  }
}

export { initMixin }

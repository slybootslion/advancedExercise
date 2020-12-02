import { initState } from './state'
import { compileToFunctions } from './compiler/index'
import { callHook, mountComponent } from './lifecycle'
import { mergeOptions, nextTick } from './utils'

function initMixin(Vue) {
  // Vue的初始化
  Vue.prototype._init = function (options) {
    const vm = this
    // vm.$options = options
    // 合并选项（如：mixin生命周期，components等）
    vm.$options = mergeOptions(vm.constructor.options, options)
    callHook(vm, 'beforeCreate')
    // 状态初始化
    initState(vm)
    callHook(vm, 'created')
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    el = el && document.querySelector(el)
    const vm = this
    const options = vm.$options
    vm.$el = el
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      options.render = compileToFunctions(template)
    }
    // 组件挂载
    mountComponent(vm)
  }

  Vue.prototype.$nextTick = nextTick
}

export { initMixin }

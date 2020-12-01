import { Watcher } from './observer/watcher'
import { patch } from "./vdom/patch";

function mountComponent(vm, el) {
  const updateComponent = () => {
    vm._update(vm._render())
  }
  // 默认通过watcher渲染
  new Watcher(vm, updateComponent, () => {}, true)
}

function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vNode) {
    const vm = this
    // vm.$el = patch(vm.$options.el, vNode)
    vm.$options.el = patch(vm.$options.el, vNode)

  }
}

export { mountComponent, lifecycleMixin }

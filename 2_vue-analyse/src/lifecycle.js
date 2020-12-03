import { Watcher } from './observer/watcher'
import { patch } from './vdom/patch'

function mountComponent(vm) {
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
    // vm.$el = patch(vm.$el, vNode)
    const prevVNode = vm._vNode // 保存上一次虚拟节点，下次更新时使用
    vm._vNode = vNode
    if (!prevVNode) {
      vm.$el = patch(vm.$el, vNode)
    } else {
      vm.$el = patch(prevVNode, vNode)
    }
  }
}

function callHook(vm, hook) {
  const handle = vm.$options[hook]
  if (handle) handle.forEach(fn => fn.call(vm))
}

export { mountComponent, lifecycleMixin, callHook }

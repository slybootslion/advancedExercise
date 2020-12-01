import { createElement, createTextVNode } from './vdom/index'

function renderMixin(Vue) {
  Vue.prototype._c = function (...args) {
    return createElement(this, ...args)
  }

  Vue.prototype._v = function (text) {
    return createTextVNode(this, text)
  }

  Vue.prototype._s = function (val) {
    return val == null ? '' : typeof val === 'object' ? JSON.stringify(val) : val
  }

  Vue.prototype._render = function () {
    const vm = this
    const render = vm.$options.render
    const vNode = render.call(vm)

    return vNode
  }
}

export { renderMixin }

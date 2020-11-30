function renderMixin (Vue) {
  // 任务8：8.产生虚拟dom 14分
  Vue.prototype._c = function () {

  }

  Vue.prototype._v = function () {

  }

  Vue.prototype._s = function () {

  }

  Vue.prototype._render = function () {
    const vm = this
    const render = vm.$options.render
    const vNode = render.call(vm)

    return vNode
  }
}

export { renderMixin }

import { Watcher } from './observer/watcher'

function mountComponent(vm, el) {
  const updateComponent = () => {
    vm._update(vm._render())
  }
  // 默认通过watcher渲染
  new Watcher(vm, updateComponent, () => {}, true)
}

function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vNode) {
    console.log('update')
  }
}

export { mountComponent, lifecycleMixin }

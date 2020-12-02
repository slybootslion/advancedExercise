// 混合全局API
import { mergeOptions } from '../utils'

function initGlobalAPI(Vue) {
  // 存放全局配置
  Vue.options = {}
  Vue.options._base = Vue

  Vue.mixin = function (mixin) {
    // this是大Vue mergeOptions本质是个对象合并的方法
    this.options = mergeOptions(this.options, mixin)
    return this
  }

  // 存放定义的组件
  Vue.options.components = {}
  Vue.component = function (id, opts) {
    opts.name = opts.name || id
    opts = Vue.options._base.extend(opts)
    this.options.components[id] = opts
  }

  let cid = 0
  Vue.extend = function (opts) {
    const Super = this
    const Sub = function (opts) {
      this._init(opts)
    }
    // 子类继承父类
    Sub.cid = cid++
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.component = Super.component
    Sub.options = mergeOptions(Super.options, opts)
    return Sub
  }
}

export { initGlobalAPI }

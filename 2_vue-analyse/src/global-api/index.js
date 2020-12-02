// 混合全局API
import { mergeOptions } from '../utils'

function initGlobalAPI(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    // this是大Vue mergeOptions本质是个对象合并的方法
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}

export { initGlobalAPI }

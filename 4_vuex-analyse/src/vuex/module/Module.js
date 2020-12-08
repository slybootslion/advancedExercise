import { forEachValue } from '@/vuex/utils'

class Module {
  constructor(rawModule) {
    this._raw = rawModule
    this._children = {}
    this.state = rawModule.state
  }

  get namespace() {
    return this._raw.namespace
  }

  // 获取子节点中的某一个
  getChild(key) {
    return this._children[key]
  }

  // 设置子节点
  setChild(key, module) {
    this._children[key] = module
  }

  forEachMutations(callback) {
    if (this._raw.mutations) forEachValue(this._raw.mutations, callback)
  }

  forEachActions(callback) {
    if (this._raw.actions) forEachValue(this._raw.actions, callback)
  }

  forEachGetters(callback) {
    if (this._raw.getters) forEachValue(this._raw.getters, callback)
  }

  forEachChildren(callback) {
    forEachValue(this._children, callback)
  }
}

export { Module }

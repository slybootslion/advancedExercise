import { _Vue } from '@/vuex/install'
import { ModuleCollection } from '@/vuex/module/ModuleCollection'
import { forEachValue } from '@/vuex/utils'

function installModule(store, path, module, rootState) {
  if (path.length > 0) {
    const parent = path.slice(0, -1).reduce((pre, cur) => pre[cur], rootState)
    // parent[path[path.length - 1]] = module.state
    // 新增属性，并且成为响应式的
    _Vue.set(parent, path[path.length - 1], module.state)
  }
  const namespace = store._module.getNamespace(path)
  module.forEachMutations((key, mutation) => {
    store.mutations[namespace + key] = store.mutations[namespace + key] || []
    store.mutations[namespace + key].push(payload => mutation.call(store, module.state, payload))
  })
  module.forEachActions((key, action) => {
    store.actions[namespace + key] = store.actions[namespace + key] || []
    store.actions[namespace + key].push(value => action.call(store, store, value))
  })
  module.forEachGetters((key, fn) => {
    store.wrapGetter[namespace + key] = () => fn.call(store, module.state)
  })
  module.forEachChildren((key, childModule) => {
    installModule(store, path.concat(key), childModule, rootState)
  })
}

function resetVMStore(store, state) {
  const computed = {}
  forEachValue(store.wrapGetter, (key, fun) => {
    computed[key] = fun
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
    })
  })

  store._vm = new _Vue({
    data() {
      return {
        $$state: state,
      }
    },
    computed,
  })
}

class Store {
  constructor(options) {
    this.options = options
    this._module = new ModuleCollection(options)
    this.mutations = {}
    this.actions = {}
    this.getters = {}
    this.wrapGetter = {}
    const state = options.state
    installModule(this, [], this._module.root, state)
    resetVMStore(this, state)
  }

  get state() {
    return this._vm._data.$$state
  }

  commit = (fnName, payload) => {
    this.mutations[fnName]?.forEach(mutation => mutation(payload))
  }

  dispatch = (type, payload) => {
    this.actions[type]?.forEach(action => action(payload))
  }
}

export { Store }

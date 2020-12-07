import { _Vue } from '@/vuex/install'

function forEachValue(obj, cb) {
  Object.keys(obj).forEach(key => cb(key, obj[key]))
}

class Store {
  constructor(options) {
    // this --> $store
    const computed = {}
    this.getters = {}
    forEachValue(options.getters, (key, value) => {
      computed[key] = () => value.call(this, this.state)
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key],
      })
    })
    this._vm = new _Vue({
      data() {
        return {
          $$state: options.state,
        }
      },
      computed,
    })
  }

  get state() {
    return this._vm._data.$$state
  }
}

export { Store }

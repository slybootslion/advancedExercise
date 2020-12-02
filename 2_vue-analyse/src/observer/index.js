import { arrayMethods } from './array'
import Dep from './dep'
import { isObject } from '../utils'

function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    const item = value[i]
    item.__ob__ && item.__ob__.dep.depend()
    if (Array.isArray(item)) dependArray(item)
  }
}

function defineReactive(data, key, value) {
  const dataOb = observe(value) // 对结果，递归拦截
  const dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend()
        if (dataOb) {
          dataOb.dep.depend()
          if (Array.isArray(value)) dependArray(value)
        }
      }
      return value
    },
    set(nValue) {
      if (nValue === value) return
      observe(nValue)
      value = nValue
      dep.notify()
    },
  })
}

class Observer {
  constructor(value) {
    // value.__ob__ = this
    this.dep = new Dep()
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false,
      configurable: false,
    })

    if (Array.isArray(value)) {
      // value.__proto__ = arrayMethods
      Object.setPrototypeOf(value, arrayMethods)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      const val = data[key]
      defineReactive(data, key, val)
    })
  }

  observeArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      observe(arr[i])
    }
  }
}

function observe(data) {
  if (!isObject(data)) return
  if (data.__ob__) return
  return new Observer(data)
}

export { observe }

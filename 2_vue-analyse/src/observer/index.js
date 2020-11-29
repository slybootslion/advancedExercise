import { arrayMethods } from './array'

function defineReactive(data, key, value) {
  observe(value) // 对结果，递归拦截

  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(nValue) {
      if (nValue === value) return
      observe(nValue)
      value = nValue
    },
  })
}

class Observer {
  constructor(value) {
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
  if (typeof data !== 'object' || data == null) return
  return new Observer(data)
}

export { observe }

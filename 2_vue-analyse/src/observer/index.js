function defineReactive(data, key, value) {
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(nValue) {
      if (nValue === value) return
      value = nValue
    },
  })
}

class Observer {
  constructor(value) {
    this.walk(value)
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      const val = data[key]
      defineReactive(data, key, val)
    })
  }
}

function observe(data) {
  if (typeof data !== 'object' || data == null) return
  return new Observer(data)
}

export { observe }

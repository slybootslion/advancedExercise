import { isObject } from "../utils/utils";

export function defineReactive (data, key, value) {
  Object.defineProperty(data, key, {
    get () {
      return value
    },
    set (newValue) {
      if (value === newValue) return false
      value = newValue
    }
  })
}

class Observer {
  constructor (value) {
    this.walk(value)
  }

  walk (data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

export function observe (data) {
  // 判断是否对象类型
  if (!isObject(data)) return false
  // Observer类 方便扩展
  const ob = new Observer(data)
}

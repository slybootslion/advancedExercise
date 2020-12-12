import { hasChange, isArray, isObject } from '../utils'
import { reactive } from './reactive'
import { track, trigger } from './effect'

class RefImpl {
  private __v_isReadonly = true
  private __v_isRef = true

  constructor(public rawValue) {}

  get value() {
    track(this, 'value')
    return convert(this.rawValue)
  }

  set value(val) {
    if (hasChange(val, this.rawValue)) {
      this.rawValue = convert(val)
      trigger(this, 'set', 'value')
    }
  }
}

function convert(val) {
  return isObject(val) ? reactive(val) : val
}

function ref(rawValue) {
  return new RefImpl(rawValue)
}

class ObjectRefImpl {
  constructor(public obj, public key) {}

  get value() {
    return this.obj[this.key]
  }

  set value(val) {
    this.obj[this.key] = val
  }
}

function toRefs(obj) {
  const res = isArray(obj) ? new Array(obj.length) : {}
  for (const objKey in obj) {
    if (obj.hasOwnProperty(objKey)) res[objKey] = new ObjectRefImpl(obj, objKey)
  }
  return res
}

export { ref, toRefs }

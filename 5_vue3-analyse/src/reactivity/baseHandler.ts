import {effectStack} from "./effect";

const mutableHandlers = {
  get(target, key, recevier) {
    // return target[key]
    return Reflect.get(target, key, recevier)
  },
  set(target, key, value, recevier) {
    // target[key] = value
    Reflect.set(target, key, value, recevier)
    effectStack.forEach(effect => effect())
  }
}

export {
  mutableHandlers
}

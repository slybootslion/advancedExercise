import {isObject} from "../utils";
import {mutableHandlers} from "./baseHandler";

const reactiveMap = new WeakMap()

function createReactiveObject(target, baseHandler) {
  if (!isObject(target)) return target
  if (!reactiveMap.has(target)) {
    const proxy = new Proxy(target, baseHandler)
    reactiveMap.set(target, proxy)
    return proxy
  }
  return reactiveMap.get(target)
}

function reactive(target) {
  return createReactiveObject(target, mutableHandlers)
}

export {
  reactive
}

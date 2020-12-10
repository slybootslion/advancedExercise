import {currentEffect, effectStack, track} from "./effect";
import {hasChange, hasOwn, isArray, isObject} from "../utils";
import {reactive} from "./reactive";

const mutableHandlers = {
  get(target, key, recevier) {
    const res = Reflect.get(target, key, recevier)
    // 依赖收集
    track(target, key)

    // 取值如果是对象，递归代理（懒代理）
    return isObject(res) ? reactive(res) : res
  },
  set(target, key, value, recevier) {
    const oldVal = target[key]

    // 判断是否新增属性
    const hadKey = isArray(target) && (parseInt(key, 10) + '' === key) ? Number(key) < target.length : hasOwn(target, key)

    const res = Reflect.set(target, key, value, recevier)
    if (!hadKey) {
      // 新增属性
    } else if (hasChange(oldVal, value)) {
      // 修改属性
    }

    return res
  }
}

export {
  mutableHandlers
}

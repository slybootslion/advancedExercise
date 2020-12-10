const effectStack: Function[] = []
let currentEffect: Function | null = null

function createReactiveEffect(fun) {
  const effect = function () {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect)
        currentEffect = effect
        return fun()
      } finally {
        effectStack.pop()
        currentEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  return effect
}

function effect(fun, opts = {}) {
  const effect = createReactiveEffect(fun)
  effect()
}

// 建立 属性和effect之间的关联（对应Vue2中的dep和watcher）
const targetMap = new WeakMap
function track(target, key) {
  if (currentEffect == undefined) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(currentEffect)) {
    dep.add(currentEffect)
  }
}

export {
  effect,
  effectStack,
  currentEffect,
  track
}

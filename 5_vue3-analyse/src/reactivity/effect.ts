import { isArray } from '../utils'

const effectStack: Function[] = []
let currentEffect: Function | null = null

function createReactiveEffect(fun, opts) {
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
  effect.options = opts
  return effect
}

function effect(fun, opts = {} as any) {
  const ef = createReactiveEffect(fun, opts)
  if (!opts?.lazy) {
    ef()
  }

  return ef
}

// 建立 属性和effect之间的关联（对应Vue2中的dep和watcher）
const targetMap = new WeakMap()

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

const run = effects => {
  if (effects)
    effects.forEach(effect => {
      // 1. 渲染对应的effect 2. 计算属性对应的effect
      if (effect.options?.scheduler) {
        effect.options.scheduler(effect)
      }else {
        effect()
      }
    })
}

function trigger(target, type, key, value?) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  if (key === 'length' && isArray(target)) {
    depsMap.forEach((dep, k) => {
      // 如果改变了数组长度，触发更新
      if (k === 'length' || k >= value) run(dep)
    })
    return
  }

  // 修改
  if (key != undefined) {
    const effects = depsMap.get(key)
    run(effects)
  }

  // 添加
  switch (type) {
    case 'add':
      if (isArray(target)) {
        if (parseInt(key) + '' === key) {
          run(depsMap.get('length'))
        }
      }
      break
    default:
      break
  }
}

export { effect, effectStack, currentEffect, track, trigger }

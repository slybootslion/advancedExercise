let fns = []
let waiting = false

function flushCallback() {
  for (let i = 0; i < fns.length; i++) {
    const fn = fns[i]
    fn()
  }
  fns = []
  waiting = false
}

function nextTick(fn) {
  fns.push(fn)
  if (!waiting) {
    // Vue3只使用了Promise其他兼容降级处理的过时玩意儿就不写了
    Promise.resolve().then(flushCallback)
    waiting = true
  }
}

const LIFECYCLE_HOOK = ['beforeCreate', 'created', 'beforeMount', 'mount']
const strats = {}

function mergeHook(parentValue, childValue) {
  if (childValue) {
    if (parentValue) {
      return parentValue.concat(childValue)
    } else {
      return [childValue]
    }
  } else {
    return parentValue
  }
}

LIFECYCLE_HOOK.forEach(hookStr => (strats[hookStr] = mergeHook))

function mergeOptions(parent, child) {
  const options = {}
  // 自定义策略
  // 1. 父级、子级都有值，用子级替换父级
  // 2. 父级有值，用父级的

  function mergeField(key) {
    // 策略模式
    if (strats[key]) {
      return (options[key] = strats[key](parent[key], child[key]))
    }
    // 非特有策略，正常合并
    if (isObject(parent[key]) && isObject(child[key])) {
      options[key] = { ...parent[key], ...child[key] }
    } else {
      if (child[key]) {
        options[key] = child[key]
      } else {
        options[key] = parent[key]
      }
    }
  }

  for (const parentKey in parent) {
    if (parent.hasOwnProperty(parentKey)) {
      mergeField(parentKey)
    }
  }

  for (const childKey in child) {
    if (child.hasOwnProperty(childKey)) {
      if (!parent.hasOwnProperty(childKey)) {
        mergeField(childKey)
      }
    }
  }
  return options
}

function isObject(obj) {
  return typeof obj === 'object' && obj != null
}

export { nextTick, mergeOptions, isObject }

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

export { nextTick }

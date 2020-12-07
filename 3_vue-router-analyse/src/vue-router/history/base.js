import { createRoute } from '@/vue-router/createMatcher'

class History {
  constructor(router) {
    this.router = router
    this.cb = null
    this.current = createRoute(null, { path: '/' })
  }

  transitionTo(path, callback) {
    const route = this.router.match(path)
    const queue = [].concat(this.router.beforeEachHooks)

    const iterator = (hook, next) => {
      hook(route, this.current, next)
    }

    runQueue(queue, iterator, () => {
      this.current = route
      this.cb && this.cb(this.current)
      callback && callback()
    })
  }

  listen(cb) {
    this.cb = cb
  }

  getCurrentLocation() {
    return window.location.pathname
  }
}

function runQueue(q, iterator, cb) {
  function next(idx) {
    if (idx >= q.length) {
      // 没有钩子函数，或者钩子函数执行完毕，调用后面的执行
      return cb()
    } else {
      const hook = q[idx]
      iterator(hook, () => next(++idx))
    }
  }
  next(0)
}

export default History

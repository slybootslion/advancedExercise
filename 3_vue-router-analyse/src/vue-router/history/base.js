import { createRoute } from '@/vue-router/createMatcher'

class History {
  constructor(router) {
    this.router = router
    this.cb = null
    this.current = createRoute(null, { path: '/' })
  }

  transitionTo(path, callback) {
    this.current = this.router.match(path)
    this.cb && this.cb(this.current)
    callback && callback()
  }

  listen(cb) {
    this.cb = cb
  }

  getCurrentLocation() {
    return window.location.pathname
  }
}

export default History

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

  getCurrentLocation() {
    return window.location.pathname
  }

  listen(cb) {
    this.cb = cb
  }
}

export default History

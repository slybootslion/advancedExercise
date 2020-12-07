import History from '@/vue-router/history/base'

class BrowserHistory extends History {
  constructor(router) {
    super(router)
  }

  getCurrentLocation() {
    return window.location.pathname
  }

  setupListener() {
    window.addEventListener('popstate', () => {
      this.transitionTo(this.getCurrentLocation())
    })
  }

  push(location) {
    this.transitionTo(location, () => {
      window.history.pushState({}, null, location)
    })
  }
}

export default BrowserHistory

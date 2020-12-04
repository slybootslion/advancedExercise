class History {
  constructor(router) {
    this.router = router
  }

  transitionTo(path, callback) {
    console.log(path)
    callback && callback()
  }

  getCurrentLocation() {
    return window.location.pathname
  }
}

export default History

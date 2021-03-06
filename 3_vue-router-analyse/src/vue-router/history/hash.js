import History from '@/vue-router/history/base'

function ensureSlash() {
  if (window.location.hash) return
  window.location.hash = '/'
}

function getHash() {
  return window.location.hash.slice(1)
}

class HashHistory extends History {
  constructor(router) {
    super(router)
    ensureSlash()
  }

  // 监听hash值变化
  setupListener() {
    window.addEventListener('popstate', () => {
      this.transitionTo(getHash())
    })
  }

  getCurrentLocation() {
    return getHash()
  }

  push(path) {
    window.location.hash = path
  }
}

export default HashHistory

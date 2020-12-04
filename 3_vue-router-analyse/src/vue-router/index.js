import { install, _Vue } from '@/vue-router/install'
import { createMatcher } from '@/vue-router/createMatcher'
import BrowserHistory from '@/vue-router/history/history'
import HashHistory from '@/vue-router/history/hash'

class VueRouter {
  constructor(options) {
    this.matcher = createMatcher(options.routes)
    switch (options.mode) {
      // this指向VueRouter的实例
      case 'history':
        this.history = new BrowserHistory(this)
        break
      case 'hash':
        this.history = new HashHistory(this)
        break
      default:
    }
  }

  init(app) {
    // 初始化，根据路径做初次匹配
    const history = this.history
    const setupHashListener = () => history.setupListener()
    history.transitionTo(history.getCurrentLocation(), setupHashListener)
  }
}

VueRouter.install = install

export default VueRouter

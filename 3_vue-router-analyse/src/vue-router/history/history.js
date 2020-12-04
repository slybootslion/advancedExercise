import History from '@/vue-router/history/base'

class BrowserHistory extends History {
  constructor(router) {
    super(router)
  }
}

export default BrowserHistory

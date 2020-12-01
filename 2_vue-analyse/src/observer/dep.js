let id = 0

class Dep {
  constructor() {
    this.id = id++
    // 属性去记住watcher
    this.subs = []
  }

  // watcher记住属性
  depend() {
    Dep.target.addDep(this)
  }

  // 记录watcher
  addSub(watcher) {
    this.subs.push(watcher)
  }

  // 通知watcher渲染
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

Dep.target = null

function pushTarget(watcher) {
  Dep.target = watcher
}

function popTarget() {
  Dep.target = null
}

export default Dep

export { pushTarget, popTarget }

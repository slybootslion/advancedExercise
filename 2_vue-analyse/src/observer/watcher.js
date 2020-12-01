import { popTarget, pushTarget } from './dep'

let id = 0

class Watcher {
  constructor(vm, fn, cb, options) {
    this.vm = vm
    this.getter = fn
    this.cb = cb
    this.options = options
    this.id = id++
    this.dep = []
    this.depsId = new Set()
    // 调用render方法，对模板中的数进行取值
    this.get()
  }

  get() {
    pushTarget(this)
    // 对属性进行取值操作
    this.getter()
    popTarget()
  }

  addDep(dep) {
    // 记录watcher
    if (!this.depsId.has(dep.id)) {
      this.dep.push(dep)
      this.depsId.add(dep.id)
      dep.addSub(this)
    }
  }

  update() {
    this.get()
  }
}

export { Watcher }

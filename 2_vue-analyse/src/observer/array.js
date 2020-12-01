const oldArrayProtoMethods = Array.prototype

const arrayMethods = Object.create(oldArrayProtoMethods)

const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

methods.forEach(method => {
  //AOP
  // 重写数组方法
  arrayMethods[method] = function (...args) {
    const result = oldArrayProtoMethods[method].call(this, ...args)
    let inserted
    const ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }
    if (inserted) ob.observeArray(inserted)
    ob.dep.notify()
    return result
  }
})

export { arrayMethods }

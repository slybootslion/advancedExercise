const oldArrayProtoMethods = Array.prototype

const arrayMethods = Object.create(oldArrayProtoMethods)

const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

methods.forEach(method => {
  //AOP
  // 重写数组方法
  arrayMethods[method] = function (...args) {
    const result = oldArrayProtoMethods[method].call(this, ...args)
    console.log('数组变化')
    return result
  }
})

export { arrayMethods }

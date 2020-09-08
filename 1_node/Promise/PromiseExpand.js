const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}

function isPromise(val) {
  return val && (typeof val.then === "function")
}

function resolvePromise(x, promise2, resolve, reject) {
  if (promise2 === x) return reject(new TypeError('不能自己等待自己完成一件事'))
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, function (y) {
          if (called) return false
          called = true
          // 递归解析成功后的值，直到是一个普通值为止
          resolvePromise(y, promise2, resolve, reject)
        }, function (r) {
          if (called) return false
          called = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return false
      called = true
      reject(e) // 防止取then时抛出异常
    }
  } else {
    resolve(x)
  }
}

class Promise {
  constructor(executor) {
    this.status = STATUS.PENDING

    this.value = undefined
    this.reason = undefined

    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (val) => {
      // 是promise就递归解析
      if (val instanceof Promise) {
        return val.then(resolve, reject)
      }

      if (this.status === STATUS.PENDING) {
        this.status = STATUS.FULFILLED
        this.value = val
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    const reject = (reason) => {
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    // 处理then中可选参数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
      throw err
    } // 这个大括号必须加

    const promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(x, promise2, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(x, promise2, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      if (this.status === STATUS.PENDING) {
        // 装饰模式
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(x, promise2, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(x, promise2, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
  }

  // 拓展1 静态resolve
  static resolve(val) {
    return new Promise((resolve, reject) => {
      resolve(val)
    })
  }

  // 拓展2 静态reject
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  // 拓展3
  catch(err) {
    return this.then(null, err)
  }

  // 拓展4
  static all(promises) {
    return new Promise((resolve, reject) => {
      let result = []
      let count = 0

      function processData(index, val) {
        result[index] = val
        if (++count === promises.length) {
          resolve(result)
        }
      }

      const len = promises.length
      for (let i = 0; i < len; i++) {
        let p = promises[i]
        if (isPromise(p)) {
          p.then((data) => {
            processData(i, data)
          }, reject)
        } else {
          processData(i, p)
        }
      }
    })
  }

  // 拓展5
  finally (callback) {
    return this.then((data) => {
      return Promise.resolve(callback()).then(() => data)
    }, err => {
      return Promise.resolve(callback()).then(() => {
        throw err
      })
    })
  }
}

// Promise.prototype.finally = function (callback) {
//   return this.then((data) => {
//     return Promise.resolve(callback()).then(() => data)
//   }, err => {
//     return Promise.resolve(callback()).then(() => {
//       throw err
//     })
//   })
// }

// 测试时调用此方法
Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise

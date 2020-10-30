const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}

function isPromise (x) {
  let then = x && x.then
  return typeof then === 'function'
}

function resolvePromise (x, promise2, resolve, reject) {
  // x如果是promise，就采用x的状态（成功或者失败）
  // If promise and x refer to the same object, reject promise with a TypeError as the reason.
  if (x === promise2) {
    return reject(new TypeError('promise被循环引用（Chaining cycle detected for promise）'))
  }

  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called = false
    try {
      let then = x.then
      if (typeof then === 'function') {
        // x是一个promise对象
        // 调用返回的promise 用它的结果 作为下一次then的结果
        then.call(x, function (y) {
          if (called) return
          called = true
          // 递归调用，直到它是一个非promise对象为止
          resolvePromise(y, promise2, resolve, reject)
        }, function (r) {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        // x是一个普通对象
        resolve(x)
      }
    } catch (err) {
      if (called) return
      called = true
      reject(err)
    }
  } else {
    // x如果是普通值，直接调用resolve
    resolve(x)
  }
}

class Promise {
  constructor (executor) {
    this.status = STATUS.PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (value instanceof Promise) return value.then(resolve, reject)

      if (this.status === STATUS.PENDING) {
        this.status = STATUS.FULFILLED
        this.value = value
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
    } catch (err) {
      reject(err)
    }
  }

  then (onFulfilled, onRejected) {
    //Both onFulfilled and onRejected are optional arguments:
    // If onFulfilled is not a function, it must be ignored.
    // If onRejected is not a function, it must be ignored.
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : x => x
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
      throw err
    }

    // then must return a promise
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(x, promise2, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }
      if (this.status === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(x, promise2, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }
      if (this.status === STATUS.PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(x, promise2, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(x, promise2, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
      }
    })

    return promise2
  }

  // 默认没有成功，只有失败
  catch (err) {
    return this.then(null, err)
  }

  // 静态resolve
  static resolve (val) {
    return new Promise((resolve, reject) => {
      resolve(val)
    })
  }

  // 静态reject
  static reject (reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  // 静态all方法
  static all (promises) {
    return new Promise((resolve, reject) => {
      let result = []
      let c = 0

      function processData (i, data) {
        result[i] = data
        if (++c === promises.length) {
          resolve(result)
        }
      }

      for (let i = 0; i < promises.length; i++) {
        let p = promises[i]
        if (isPromise(p)) {
          // promise
          p.then(res => processData(i, res), reject)
        } else {
          // 普通值
          processData(i, p)
        }
      }
    })
  }

  // 静态race
  static race (promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        const current = promises[i]
        if (isPromise(current)) {
          current.then(resolve, reject)
        } else {
          resolve(current)
        }
      }
    })
  }

  // finally方法
  finally (callback) {
    return this.then(data => {
      return Promise.resolve(callback()).then(() => data)
    }, err => {
      return Promise.resolve(callback()).then(() => {
        throw err
      })
    })
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

// 测试用，是否符合规范
// 这个文件肯定没问题 绝对的promisesA+规范标准
// npm install promises-aplus-tests -g

module.exports = Promise

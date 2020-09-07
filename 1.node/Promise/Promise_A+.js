const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
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
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err} // 这个大括号必须加

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
}

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

// Promise的链式调用
/*
1. 如果then方法中返回的不是一个promise，会将这个值传递给外层下一个then的成功结果
2. 如果执行then方法中抛出异常，会走到下一个then的失败
3. 如果返回的是一个promise，会用这个promise的结果作为下一次then的成功或者失败

所以会走then的失败结果条件： 1、出错 2、返回的promise出错
其他全部走then的成功
处理错误就近原则，处理不了走下一层

catch就是then的别名，是一个没有成功只有失败的then

then方法之所以可以链式调用？
因为每次都返回一个新的promise
*/

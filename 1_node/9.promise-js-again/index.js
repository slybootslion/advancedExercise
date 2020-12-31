const STATUS = {
  pending: "PENDING",
  fulfilled: 'FULFILLED',
  rejected: 'REJECTED'
}

class Promise {
  constructor (executor) {
    this.status = STATUS.pending
    this.value = undefined
    this.reason = undefined
    this.onResolveCallbacks = []
    this.onRejectCallbacks = []

    const resolve = (value) => {
      if (this.status === STATUS.pending) {
        this.status = STATUS.fulfilled
        this.value = value
        this.onResolveCallbacks.forEach(fn => fn())
      }
    }

    const reject = (reason) => {
      if (this.status === STATUS.pending) {
        this.status = STATUS.rejected
        this.reason = reason
        this.onRejectCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : x => x
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
      throw err
    }

    const promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.fulfilled) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(x, promise2, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }

      if (this.status === STATUS.rejected) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(x, promise2, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }

      if (this.status === STATUS.pending) {
        this.onResolveCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(x, promise2, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
        this.onRejectCallbacks.push(() => {
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
}

function resolvePromise (x, promise2, resolve, reject) {
  if (promise2 === x) return reject(new TypeError('不能自己等待自己做事的结果呀大兄弟 chaining cycle detected for promise'))

  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called = false
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(y, promise2, resolve, reject)
        }, r => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (err) {
      if (called) return
      called = true
      reject(err)
    }
  } else {
    resolve(x)
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

module.exports = Promise

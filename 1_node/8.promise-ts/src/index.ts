const enum STATUS {
  pending = "PENDING",
  fulfilled = "FULFILLED",
  rejected = "REJECTED",
}

type executorType = (resolve: (val?: undefined) => void, reject: (reason?: undefined) => void) => void

type onFunType = (result?: undefined) => void

type returnFunType = (x: any) => void

class Promise {
  static deferred: Function;
  private status: STATUS;
  private value: undefined;
  private reason: undefined;
  private onResolveCallback: Function[];
  private onRejectCallback: Function[];

  constructor(executor: executorType) {
    this.status = STATUS.pending
    this.value = undefined
    this.reason = undefined
    this.onResolveCallback = []
    this.onRejectCallback = []
    const resolve = (value?: undefined) => {
      if (this.status === STATUS.pending) {
        this.status = STATUS.fulfilled
        this.value = value
        this.onResolveCallback.forEach(fun => fun())
      }
    }
    const reject = (reason?: undefined) => {
      if (this.status === STATUS.pending) {
        this.status = STATUS.rejected
        this.reason = reason
        this.onRejectCallback.forEach(fun => fun())
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled?: onFunType, onRejected?: onFunType) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
      throw err
    }

    // 每次调用then返回一个新的promise
    const promise2 = new Promise((resolve: returnFunType, reject: returnFunType) => {
      if (this.status === STATUS.fulfilled) {
        setTimeout(() => {
          try {
            const x = onFulfilled && onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }

      if (this.status === STATUS.rejected) {
        setTimeout(() => {
          try {
            const x = onRejected && onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }

      if (this.status === STATUS.pending) {
        this.onResolveCallback.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled && onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
        this.onRejectCallback.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected && onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
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

function resolvePromise(promise2: Promise, x: any, resolve: returnFunType, reject: returnFunType) {
  if (x == promise2 ) {
    return reject(new TypeError('不能自己返回自己 chaining cycle detected for promise'))
  }

  if ((typeof x === 'object' && typeof x !== null) || typeof x === 'function') {
    let called = false
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(x, (y: any) => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, (r: any) => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      reject(e)
    }
  } else {
    resolve(x)
  }

}

// 测试用
Promise.deferred = function () {
  const dfd = {} as any
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

export default Promise

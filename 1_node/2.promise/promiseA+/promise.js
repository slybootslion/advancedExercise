const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}

class Promise {
  constructor (executor) {
    this.status = STATUS.PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
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
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === STATUS.FULFILLED) {
        try {
          const x = onFulfilled(this.value)
          resolve(x)
        } catch (err) {
          reject(err)
        }
      }
      if (this.status === STATUS.REJECTED) {
        try {
          const x = onRejected(this.reason)
          resolve(x)
        } catch (err) {
          reject(err)
        }
      }
      if (this.status === STATUS.PENDING) {
        this.onResolvedCallbacks.push(() => {
          try {
            const x = onFulfilled(this.value)
            resolve(x)
          } catch (err) {
            reject(err)
          }
        })
        this.onRejectedCallbacks.push(() => {
          try {
            const x = onRejected(this.reason)
            resolve(x)
          } catch (err) {
            reject(err)
          }
        })
      }
    })


    return promise2
  }
}

module.exports = Promise

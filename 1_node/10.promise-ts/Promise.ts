enum Status {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
}

type Resolve<T> = (value: T | PromiseLike<T>) => void
type Reject = (reason?: any) => void
type Executor<T> = (resolve: Resolve<T>, reject: Reject) => void
type onFulfilled<T, TResult1> = (value: T) => TResult1 | PromiseLike<TResult1> | undefined | null
type onRejected<TResult2> = (reason: any) => TResult2 | PromiseLike<TResult2> | undefined | null

function isPromise(value: any): value is Promise<any> {
  return (
    ((typeof value === 'object' && value !== null) || typeof value === 'function') && typeof value.then === 'function'
  )
}

class Promise<T> {

  status: Status = Status.PENDING
  private value!: PromiseLike<T> | T
  private reason?: any
  private onFulfilledCallback: (() => void)[] = []
  private onRejectedCallback: (() => void)[] = []


  constructor(executor: Executor<T>) {
    try {
      // 防止this丢失
      executor(this._resolve.bind(this), this._reject.bind(this))
    } catch (err) {
      this._reject(err)
    }
  }

  private _resolve(value: T | PromiseLike<T>) {
    try {
      setTimeout(() => {
        if (isPromise(value)) {
          value.then(this._resolve.bind(this), this._reject.bind(this))
          return
        }

        if (this.status === Status.PENDING) {
          this.status = Status.FULFILLED
          this.value = value
          this.onFulfilledCallback.forEach(fn => fn())
        }
      })
    } catch (err) {
      this._reject(err)
    }
  }

  private _reject(reason:any) {
    setTimeout(() => {
      if (this.status === Status.PENDING) {
        this.status = Status.REJECTED
        this.reason = reason
        this.onRejectedCallback.forEach(fn => fn())
      }
    })
  }

  public then () {

  }
}

export default Promise

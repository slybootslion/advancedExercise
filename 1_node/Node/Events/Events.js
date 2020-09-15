function EventEmitter () {
  this._events = {}
}

// 订阅
EventEmitter.prototype.on = function (eventName, callback) {
  if (!this._events) {
    this._events = Object.create(null)
  }
  if (eventName !== 'newListener') {
    this.emit('newListener', eventName)
  }
  if (this._events[eventName]) {
    this._events[eventName].push(callback)
  } else {
    this._events[eventName] = [callback]
  }
}

// 发布
EventEmitter.prototype.emit = function (eventName, ...args) {
  if (!this._events) return false
  if (this._events[eventName]) {
    this._events[eventName].forEach(fn => fn(...args))
  }
}

// 删除
EventEmitter.prototype.off = function (eventName, callback) {
  if (!this._events) return false
  this._events[eventName] = this._events[eventName].filter(fn => fn !== callback && fn.l !== callback)
}

// 只执行一次
EventEmitter.prototype.once = function (eventName, callback) {
  const once = (...args) => {
    callback(...args)
    this.off(eventName, once)
  }
  once.l = callback
  this.on(eventName, once)
}

module.exports = EventEmitter

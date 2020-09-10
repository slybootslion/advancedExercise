// node为例
function promisify (fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, function (err, data) {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }
}

function promisifyAll (target) {
  Reflect.ownKeys(target).forEach(key => {
    if (typeof target[key] !== 'function') {
      target[key + 'Async'] = promisify(target[key])
    }
  })
  return target
}

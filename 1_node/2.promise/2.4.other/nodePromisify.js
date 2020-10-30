const fs = require('fs')

function promisify (fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }
}

const readFile = promisify(fs.readFile)
readFile('../testfile.txt', 'utf8').then(console.log)

function promisifyAll (target) {
  Reflect.ownKeys(target).forEach(key => {
    if (typeof target[key] === 'function') {
      target[key + 'Async'] = promisify(target[key])
    }
  })
  return target
}

const obj = promisifyAll(fs)
obj.readFileAsync('../testfile.txt', 'utf8').then(console.log)

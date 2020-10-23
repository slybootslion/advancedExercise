const fs = require('fs')
const Promise = require('./promise')

// read file promisify
function read (...args) {
  // 延迟对象
  let dfd = Promise.defer()
  fs.readFile(...args, function (err, data) {
    if (err) return dfd.reject(err)
    dfd.resolve(data)
  })
  return dfd.promise
}

read('../testfile.txt', 'utf8').then(data => {
  return new Promise((resolve, reject) => {
    resolve({ content: data })
  })
}).then(data => console.log(data))

/*
* 静态方法resolve
* */
const p0 = new Promise((resolve, reject) => {
  setTimeout(() => resolve('ok'))
})
Promise.resolve(p0).then(res => console.log(res))

/*
* 静态方法reject 和 catch
* */
Promise.reject(p0).catch(err => console.log(err))

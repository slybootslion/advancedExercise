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

/*
* promise all
* */
const fsp = require('fs').promises
let getFile1 = fsp.readFile('../testfile.txt', 'utf8')
let getFile2 = fsp.readFile('../testfile.txt', 'utf8')

Promise.all([1, getFile1, getFile2, 2]).then(res => console.log(res))

/*
* promise  finally
* */
Promise.reject(123).finally(data => {
  console.log('finally')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('finally ok')
    }, 1000)
  })
}).then(data => {
  console.log('finally then', data)
}, err => {
  console.log('finally err', err)
}).catch(err => console.log('finally catch:', err))

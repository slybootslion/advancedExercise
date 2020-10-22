const fs = require('fs')
const Promise = require('./promise')

// read file promisify
function read (...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

/*
promise链式调用问题总结：
1. 如果then方法中（成功或者失败）返回的不是一个promise，会将这个值传递给外层下一次的then的成功结果
2. 如果执行then方法中抛出异常，走下一次then的失败
3. 如果返回的是一个promise，会用这个promise的结果作为下一次then的成功或者失败

promise走失败的情况：
1. 抛出异常
2. 返回的promise出错

then方法为什么可以链式调用？
每次调用then都返回一个新的promise

catch就是then的别名，没有成功只有失败的then
错误会就近优先处理，处理不了就走下一层
*/

read('file.txt', 'utf8').then(data => {
  return new Promise((resolve, reject) => {
    resolve({ content: data })
  })
}).then().then().then(data => console.log(data))

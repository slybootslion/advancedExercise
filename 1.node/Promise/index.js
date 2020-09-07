const BasicPromise = require('./BasicPromise.js')
const MyPromise = require('./Promise_A+.js')
const bp = new MyPromise((resolve, reject) => {
  // throw new Error('err msg')
  // resolve('成功的内容')
  // reject('失败的内容')

  setTimeout(() => {
    resolve('成功的回调，定时器里')
  }, 1000)
})

bp.then((data) => {
  console.log('success', data)
}, (reason) => {
  console.log('fail', reason)
})

console.log('pass')

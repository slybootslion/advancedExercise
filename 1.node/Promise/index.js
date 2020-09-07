const BasicPromise = require('./basic-promise.js')
const bp = new BasicPromise((resolve, reject) => {
  // throw new Error('err msg')
  // resolve('成功的内容')
  // reject('失败的内容')
})

bp.then((data) => {
  console.log('success', data)
}, (reason) => {
  console.log('fail', reason)
})

console.log('pass')

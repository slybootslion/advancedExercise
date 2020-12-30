const Promise = require('./bundle')

// const promise = new Promise((resolve, reject) => {
//   // throw new Error('主动抛出错误')
//   resolve('ok')
//   // setTimeout(() => {
//   //   reject('error')
//   // }, 500)
// }).then(res => {
//   return 1
//   // return new Promise((resolve, reject) => resolve(100))
//   // throw new Error('error msg')
// }, err => {
//   return 10
//   // throw new Error('error')
// })

// promise.then(res => console.log(res, '<----res'), err => console.log(err, '<----err'))

// promise.then(res => {
//   console.log(res)
// }, err => {
//   console.log(err)
// })

new Promise((resolve, reject) => {
  resolve('ok')
}).then(res => {
  return new Promise((resolve, reject) => {

    setTimeout(() => {
      resolve(new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('the xx')
        }, 100)
      }))
    }, 1000)
  })
}, err => {

}).then(res => {
  console.log(res)
})

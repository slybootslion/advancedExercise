// 超时处理
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 2050)
})

function wrap (promise) {
  let abort
  // 空的promise
  let p2 = new Promise((resolve, reject) => {
    abort = reject
  })
  let newP = Promise.race([promise, p2])
  newP.abort = abort
  return newP
}

const p2 = wrap(p1)
p2.then(data => console.log(data)).catch(err => console.log(err))
setTimeout(() => {
  p2.abort('请求超时')
}, 2000)

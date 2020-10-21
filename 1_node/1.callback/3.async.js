const fs = require('fs')

let obj = {}
// 异步串行，解决异步问题，核心就是回调函数加计数器
function after (times, callback) {
  return function () {
    --times === 0 && callback()
  }
}

let fn = after(2, () => {
  console.log(obj)
})

fs.readFile('age.txt', 'utf8', (err, data) => {
  obj.age = data
  fn()
})

fs.readFile('name.txt', 'utf8', (err, data) => {
  obj.name = data
  fn()
})

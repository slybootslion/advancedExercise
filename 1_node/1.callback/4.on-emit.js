// 发布订阅
const fs = require('fs')
let eventObj = {
  arr: [],
  on (fn) {
    this.arr.push(fn)
  },
  emit () {
    this.arr.forEach(fn => fn())
  }
}

const obj = {}

fs.readFile('age.txt', 'utf8', (err, age) => {
  obj.age = age
  eventObj.emit()
})

fs.readFile('name.txt', 'utf8', (err, name) => {
  obj.name = name
  eventObj.emit()
})

eventObj.on(() => {
  if (Object.keys(obj).length === 2) {
    console.log('数据读取完毕', obj)
  }
})

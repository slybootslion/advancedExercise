/*
promise解决的问题：
1. 异步并发问题（promise.all）
2. 解决回调地狱问题，将嵌套的函数变为链式操作
3. 方便错误处理 （catch）

缺陷：
依然是基于回调函数

promise a+规范：
https://promisesaplus.com/
* */

// 1.Promise是一个类，类中的构造函数需要传入一个executor，默认就会执行
// 2.executor中有两个参数，分别是resolve和reject
// 3.默认创建一个promise实例，有三种状态，分别是pending  fulfilled  rejected
// 4.调用成功和失败时，需要传递一个成功的原因和失败的原因
// 5.如果已经成功了就不能失败了
// 6.每一个promise实例都有一个then方法
// 7.如果抛出异常按照失败来处理

// 初版promise实现

const Promise = require('./promise')

const p = new Promise((resolve, reject) => {
  console.log(1)
  reject('失败')
  resolve('成功')
})

p.then((data) => {
  console.log(data)
}, (reason) => {
  console.log(reason)
})

console.log(2)

// 文件操作读和写 流： 可读流 可写流 （异步读写）
const fs = require('fs')
const path = require('path')

const examplePath = '../Require/exampleFile/example.md'

const { ReadStream } = require('./ReadStream')

// 创建可读流 不会占用大量内存
/*const rs = fs.createReadStream(path.resolve(__dirname, examplePath), {
  // flags: 'r', // 打开文件做什么事
  highWaterMark: 6, // 每次读取一个字节数，默认64k
  //mode: 0o666, // 可读可写
  // start: 0, // 开始位置
   end: 18, // 结束读取的位置
  // encoding: 'utf8', // 默认buffer，utf8为读取字符串
  // autoClose: true // 读取完毕自动关闭
})*/

const rs = new ReadStream(path.resolve(__dirname, examplePath))

// return
rs.on('error', err => {
  console.log('出错了', err)
})

rs.on('open', () => {
  console.log('文件打开了')
})

// 非流模式 → 流模式
const arr = []
rs.on('data', chunk => {
  arr.push(chunk)
})

rs.on('end', () => {
  // 拼接buffer 转字符串
  console.log(arr)
  console.log(Buffer.concat(arr).toString())
  console.log('读取完毕')
})

rs.on('close', () => {
  console.log('文件关闭了')
})

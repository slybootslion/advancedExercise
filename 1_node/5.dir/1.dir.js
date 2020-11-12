const fs = require('fs')
const path = require('path')

/*
* 1. 如何创建文件夹
* 2. 如何删除文件夹
* 3. 如何判断是不是文件夹
* 4. 文件夹中的内容
* */

// 异步版本

// 常用方法
// fs.mkdir
// fs.rmdir
// fs.readdir
// fs.stat stat.isFile stat.isDirectory
// fs.unlink

fs.mkdir('a', err => console.log)
fs.rmdir('a', err => console.log)
fs.readdir('testdir', (err, dirs) => {
  dirs = dirs.map(item => {
    const p = path.join(__dirname, 'testdir', item)
    fs.stat(p, (err, stat) => {
      console.log(stat.isDirectory(), stat.isFile())
    })
    return p
  })
})


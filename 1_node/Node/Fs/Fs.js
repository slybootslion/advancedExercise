const fs = require('fs')
const path = require('path')

// const res = fs.readFileSync(path.resolve(__dirname, '../Require/exampleFile/example.md'))
// console.log(res)

// 读取文件
/*fs.readFile(path.resolve(__dirname, '../Require/exampleFile/example.md'), 'utf8', (err, data) => {
  console.log(data)
})*/

// 删除文件夹 深度遍历 同步
// fs.statSync 获取文件夹的状态 返回statObj对象 statObj.isDirectory()判断是否文件夹
// fs.readdirSync 读取目录中的内容，返回一个数组
function removeDirSeriesSync (dir) {
  let statObj = fs.statSync(dir)
  if (statObj.isDirectory()) {
    let dirs = fs.readdirSync(dir)
    for (let i = 0; i < dirs; i++) {
      let current = path.join(dir, dirs[i])
      removeDirSync(current) // 递归删除子节点
    }
    fs.rmdirSync(dir)
  } else {
    fs.unlinkSync(dir)
  }
}

// 删除文件夹 广度遍历 同步
function removeDirWideSync (dir) {
  let arr = [dir]
  let index = 0
  let current
  while (current = arr[index++]) {
    const statObj = fs.statSync(current)
    if (statObj.isDirectory()) {
      let dirs = fs.readdirSync(current)
      dirs = dirs.map(d => path.join(current, d))
      arr = [...arr, ...dirs]
    }
  }
  for (let i = arr.length - 1; i >= 0; i--) {
    let current = arr[i]
    let statObj = fs.statSync(current)
    if (statObj.isDirectory()) {
      fs.rmdirSync(current)
    } else {
      fs.unlinkSync(current)
    }
  }
}

// 删除文件夹 串行 异步
function rmdirSeriesAsync (dir, callback) {
  fs.stat(dir, (err, statObj) => {
    if (statObj.isDirectory()) {
      fs.readdir(dir, (err, dirs) => {
        dirs = dirs.map(d => path.join(dir, d))

        function next (index) {
          if (index === dirs.length) return fs.rmdir(dir, callback)
          rmdirSeries(dirs[index], () => next(index + 1))
        }

        next(0)
      })
    } else {
      fs.unlink(dir, callback)
    }
  })
}

// 删除文件夹 并发 异步
function removeDirParallel (dir, callback) {
  fs.stat(dir, (err, statObj) => {
    if (statObj.isDirectory()) {
      fs.readdir(dir, (err, dirs) => {
        if (dirs.length === 0) return fs.rmdir(dir, callback)
        // 并发删除
        dirs = dirs.map(d => {
          let current = path.join(dir, d)
          removeDirParallel(current, done)
          return current
        })

        let index = 0

        function done () {
          if (++index === dirs.length) fs.rmdir(dir, callback)
        }

      })
    } else {
      fs.unlink(dir, callback)
    }
  })
}

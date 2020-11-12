const path = require('path')
const fs = require('fs')

/*删除文件夹*/

/*树遍历 后序遍历*/

function rmdir (dir, cb) {
  fs.stat(dir, (err, stat) => {
    if (stat.isFile()) {
      fs.unlink(dir, cb)
    } else {
      fs.readdir(dir, (err, dirs) => {
        dirs = dirs.map(item => path.join(dir, item))

        // 串行
        /*let index = 0

        function next () {
          if (index === dirs.length) return fs.rmdir(dir, cb)
          let current = dirs[index++]
          rmdir(current, next)
        }

        next()*/

        // 并行
        function removeDir (dir, cb) {
          fs.rmdir(dir, cb)
        }

        if (dirs.length === 0) {
          return removeDir(dir, cb)
        }

        let index = 0

        function done () {
          if (++index === dirs.length) {
            removeDir(dir, cb)
          }
        }

        for (let i = 0; i < dirs.length; i++) {
          const dir = dirs[i]
          rmdir(dir, done)
        }

      })
    }
  })
}

rmdir(path.join(__dirname, 'testdir'), () => console.log('删除完毕'))

const fs = require('fs')

function bodyParser (ctx, next) {
  return async (ctx, next) => {
    ctx.request.body = await body(ctx)
    return next()
  }
}

/*有问题*/
Buffer.prototype.split = function (boundary) {
  const arr = []
  let offset = 0
  let currentPosition = 0
  while (-1 !== (currentPosition = this.indexOf(boundary))) {
    arr.push(this.slice(offset, currentPosition))
    offset = currentPosition + boundary.length
  }
  arr.push(this.slice(offset))
  return arr
}

function body (ctx) {
  return new Promise((resolve, reject) => {
    const arr = []
    ctx.req.on('data', (chunk) => arr.push(chunk))
    ctx.req.on('end', () => {
      const type = ctx.get('content-type')
      const data = Buffer.concat(arr)

      if (type === 'application/x-www-form-urlencoded') {
        const d = {}
        const arr = data.toString().split('&')
        for (let i = 0; i < arr.length; i++) {
          d[arr[i][0]] = arr[i][i]
        }
        resolve(JSON.parse(d))
      }

      if (type === 'application/json') {
        resolve(JSON.parse(data.toString()))
      }

      if (type === 'text/plain') {
        resolve(data.toString())
      }

      if (type.startsWith('multipart/form-data')) {
        const boundary = `--${type.split('=')[1]}`
        let lines = data.split(boundary) // Buffer上的split自己扩展
        lines = lines.slice(1, -1)
        let resObj = {}
        lines.forEach(line => {
          const [head, body] = line.split('\r\n\r\n')
          if (head) {
            const key = head.toString().match(/name="(.+?)"/)[1]
            if (!head.includes('filename')) {
              resObj[key] = body.slice(0, -2).toString()
              resolve(resObj)
            } else {
              // 文件上传
              const filename = head.toString().match(/filename="(.+?)"/)[1]
              const content = line.slice(head.length + 4, -2)
              fs.writeFileSync(path.join(__dirname, filename), content)
              resObj[key] = resObj[key] || []
              resObj[key].push({
                size: content.length,
                name: filename,
              })
            }
          }
        })
      }
      resolve()
    })
  })
}

module.exports = bodyParser

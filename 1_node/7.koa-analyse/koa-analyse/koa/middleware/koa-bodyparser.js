const querystring = require('querystring')
const uuid = require('uuid')
const fs = require('fs')
const path = require('path')

function bodyparser(uplodaDir) {
  return async (ctx, next) => {
    const res = await body(ctx, uplodaDir)
    console.log(res)
    ctx.request.body = res
    return next()
  }
}

function body(ctx, uplodaDir) {
  return new Promise((resolve, reject) => {
    let arr = []
    ctx.req.on('data', chunk => arr.push(chunk))
    ctx.req.on('end', () => {
      const type = ctx.get('content-type')
      const data = Buffer.concat(arr)
      if (type === 'application/x-www-form-urlencoded') {
        resolve(querystring.parse(data.toString()))
      }
      if (type === 'application/json') {
        resolve(JSON.parse(data.toString()))
      }
      if (type.startsWith('multipart/form-data')) {
        // 文件上传后的data样例
        /*
        ------WebKitFormBoundarylIiZieOFXLA0Ao3f
Content-Disposition: form-data; name="avatar"; filename="testfile.txt"
Content-Type: text/plain

hello

koa


bodyparser

------WebKitFormBoundarylIiZieOFXLA0Ao3f--
        */
        const boundary = `--${type.split('=')[1]}`
        const lines = data.split(boundary).slice(1, -1)
        const resultObj = {}
        lines.forEach(line => {
          const [head, body] = line.split('\r\n\r\n')
          const key = head.toString().match(/name="(.+?)"/)[1]
          if (!head.includes('filename')) {
            resultObj[key] = body.slice(0, -2).toString()
          } else {
            // 文件上传
            const originalName = head.toString().match(/filename="(.+?)"/)[1]
            const filename = uuid.v4()
            const content = line.slice(head.length + 4, -2)
            fs.writeFileSync(path.join(uplodaDir, filename), content)
            resultObj[key] = (resultObj[key] || [])
            resultObj[key].push({
              size: content.length,
              name: originalName,
              filename
            })
          }
        })
        resolve(resultObj)
      }
      resolve()
    })
  })
}

Buffer.prototype.split = function (boundary) {
  const arr = []
  let offset = 0
  let currentPosition = 0
  while (-1 != (currentPosition = this.indexOf(boundary, offset))) {
    arr.push(this.slice(offset, currentPosition))
    offset = currentPosition + boundary.length
  }

  arr.push(this.slice(offset))
  return arr
}

// console.log(Buffer.from('1&22&333&1').split('&'))

module.exports = bodyparser

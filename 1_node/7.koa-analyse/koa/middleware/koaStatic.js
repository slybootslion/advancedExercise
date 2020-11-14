const path = require('path')
const fs = require('fs').promises
const { createReadStream } = require('fs')

function static (dirname) {
  return async (ctx, next) => {
    const filePath = dirname ? path.join(dirname, ctx.path) : path.join(__dirname, '../../', ctx.path)

    try {
      const statObj = await fs.stat(filePath)
      if (statObj.isFile()) {
        ctx.set('Content-Type', 'text/html;charset=utf-8')
        ctx.body = createReadStream(filePath)
      } else {
        await next()
      }
      return next()
    } catch (e) {
      await next()
    }
  }
}

module.exports = static

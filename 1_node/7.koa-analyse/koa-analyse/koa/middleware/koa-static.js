const path = require('path')
const fs = require('fs').promises
const { createReadStream } = require('fs')

function static(dirname) {
  return async (ctx, next) => {
    let filepath = path.join(dirname, ctx.path)
    try {
      let statObj = await fs.stat(filepath)
      if (statObj.isFile) {
        ctx.set('Content-Type', 'text/html;charset=utf-8')
        ctx.body = createReadStream(filepath)
      } else {
        await next()
      }
    } catch (e) {
      await next()
    }
  }
}

module.exports = static

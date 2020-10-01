const queryString = require('querystring')

function body (ctx) {
  return new Promise((resolve, reject) => {
    const arr = []
    ctx.req.on('data', function (chunk) {
      arr.push(chunk)
    })
    ctx.req.on('end', function () {
      const type = ctx.get('content-type')
      const data = Buffer.concat(arr)

      if (type === 'application/x-www-form-urlencoded') {
        resolve(queryString.parse(data.toString()))
      }

      if (type === 'application/json') {
        resolve(JSON.parse(data.toString()))
      }

      if (type === 'text/plain') {
        resolve(data.toString())
      }

      resolve()
    })
  })
}


module.exports = function bodyParser () {
  return async (ctx, next) => {
    ctx.request.body = await body(ctx)
    await next()
  }
}

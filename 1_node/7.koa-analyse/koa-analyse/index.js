const Koa = require('./koa')
const fs = require('fs')
const path = require('path')

const app = new Koa()
app.use(function (ctx) {
  // console.log(ctx.req.url)
  // console.log(ctx.request.req.url)
  // console.log(ctx.request.path)
  // console.log(ctx.path)
  // ctx.body = 'hello world'
  // 文本
  // ctx.body = 'hello koa'
  // 文件
  // ctx.body = fs.createReadStream(path.join(__dirname, '../testfile/index.html'))
  // json
  ctx.body = { body: 'json' }
  // console.log(ctx.body)
})

app.listen(10000, () => {
  console.log('监听10000端口')
})

const fs = require('fs')
const path = require('path')
const Koa = require('./koa')
const app = new Koa()

app.use(ctx => {
  /* koa中的两套四组 */
  // ctx.req.url 原生
  // ctx.request.req.url 原生
  // ctx.request.url koa封装
  // ctx.url koa封装
  console.log(ctx.req.url)
  console.log(ctx.request.req.url)
  console.log(ctx.request.path)
  console.log(ctx.path)

  // 返回字符串
  // ctx.body = 'hello world'
  // ctx.body = 'hello koa'

  // 返回文件
  // ctx.body = fs.createReadStream(path.join(__dirname, './testfile/index.html'))

  // 返回json
  ctx.body = { name: 'slybootslion' }
})

const port = 10000

app.listen(port, () => {
  console.log(`监听端口：${port}`)
})

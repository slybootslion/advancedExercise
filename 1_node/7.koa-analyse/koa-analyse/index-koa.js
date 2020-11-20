const Koa = require('./koa')
const fs = require('fs')
const path = require('path')

const app = new Koa()

// 基础实现
/* app.use(function (ctx) {
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
}) */

function sleep() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
      console.log('sleep')
    }, 1000)
  })
}
// 中间件
app.use(async (ctx, next) => {
  console.log(1)
  await next()
  // throw new Error('handle throw error')
  console.log(2)
})

app.use(async (ctx, next) => {
  console.log(3)
  await sleep()
  await next()
  console.log(4)
})

app.use(async (ctx, next) => {
  console.log(5)
  await next()
  console.log(6)
  ctx.body = 'koa analyse'
})

// 错误处理
app.on('error', (params) => {
  console.log('****error msg****')
  console.log(params)
  console.log('****error msg****')
})

app.listen(10000, () => {
  console.log('index koa: 监听10000端口')
})

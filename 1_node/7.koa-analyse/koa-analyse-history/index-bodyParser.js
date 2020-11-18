const fs = require('fs')
const path = require('path')
const Koa = require('./koa')

const bodyParser = require('./koa/middleware/koaBodyParser')
const koaStatic = require('./koa/middleware/koaStatic')

const app = new Koa()

app.use(bodyParser())
app.use(koaStatic())

/*
app.use(async (ctx, next) => {
  if (ctx.path === '/login' && ctx.method === 'GET') {
    ctx.set('Content-Type', 'text/html;charset=utf-8')
    ctx.body = `
      <form method="post">
        <input type="text" name="username">
        <input type="text" name="password">
        <button>提交</button>
      </form>
    `
  } else {
    await next()
  }
})
*/

app.use(async (ctx, next) => {
  if (ctx.path === '/login' && ctx.method === 'POST') {
    // 读取用户传递的数据
    ctx.set('Content-Type', 'text/html;charset=utf-8')
    ctx.body = `提交数据：${ctx.request.body}`
  } else {
    next()
  }
})

app.use(async (ctx, next) => {
  if (ctx.path === '/upload' && ctx.method === 'POST') {
    // 读取用户传递的数据
    ctx.set('Content-Type', 'text/html;charset=utf-8')
    ctx.body = `提交数据：${ctx.request.body}`
  } else {
    next()
  }
})

const port = 10000
app.listen(port, () => {
  console.log(`监听端口：${port}`)
})

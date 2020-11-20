const path = require('path')
const Koa = require('koa')
const bodyparser = require('./koa/middleware/koa-bodyparser')
const static = require('./koa/middleware/koa-static')
const app = new Koa()

app.use(bodyparser(path.resolve(__dirname, '../testfile/upload')))
app.use(static(path.join(__dirname, '../testfile')))

/* app.use(async (ctx, next) => {
  if (ctx.path === '/login' && ctx.method === 'GET') {
    ctx.body = `
      <form action="/login" method="post">
        <input type="text" name="username" placeholder="用户名"/>
        <input type="password" name="password" autocomplete="false" placeholder="密码"/>
        <button>登录</button>
      </form>
    `
  } else {
    await next()
  }
}) */

app.use(async (ctx, next) => {
  if (ctx.path === '/login' && ctx.method === 'POST') {
    ctx.body = ctx.request.body
  } else {
    next()
  }
})

app.use(async (ctx, next) => {
  if (ctx.path === '/upload' && ctx.method === 'POST') {
    ctx.body = ctx.request.body
  } else {
    next()
  }
})

app.listen(10000, () => {
  console.log('index bodyparser: 监听10000端口')
})

const Koa = require('./myKoa')
// const bodyParser = require('./myKoa/lib/koa-bodyparser')
const koaStatic = require('./myKoa/lib/koa-static')
const app = new Koa()

// app.use(bodyParser())
app.use(koaStatic(__dirname))

app.use(async ctx=> {
  // console.log('in')
  // ctx.body = 'hello koa'
  ctx.body = { a: 1 }
})

app.listen(10000, () => {
  console.log('server on port 10000')
})

const Koa = require('koa')

const app = new Koa()
app.use(function  (ctx){
  ctx.body = "hello koa"
})

app.listen(10000, () => {
  console.log('监听10000端口')
})

const fs = require('fs')
const path = require('path')
const Koa = require('./koa')
const app = new Koa()

const sleep = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
      console.log('sleep')
    }, 500)
  })
}

app.use(async (ctx, next) => {
  console.log(1)
  await next()
  // throw new Error('error msg')
  console.log(2)
})

app.use(async (ctx, next) => {
  console.log(3)
  await sleep()
  await next()
  console.log(4)
})

app.use(async (ctx, next) => {
  ctx.body = '5'
  console.log(5)
  await next()
  ctx.body = '6'
  console.log(6)
})

app.on('error', function (err) {
  console.log('---err--->>>', err)
})

const port = 10000

app.listen(port, () => {
  console.log(`监听端口：${port}`)
})

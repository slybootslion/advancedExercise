const Koa = require('koa')
const KoaRouter = require('koa-router')
const { initRouter } = require('./init/initRouter.js')
const { initCors } = require('./init/initCore')

const app = new Koa()

initCors(app)
initRouter(app)

app.listen(10003, () => console.log('监听10003端口'))

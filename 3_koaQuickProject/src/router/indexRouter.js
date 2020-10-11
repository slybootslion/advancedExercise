const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('/', async ctx => {
  ctx.body = {
    msg: 'ok',
    errorCode: 0,
    data: {
      test: 123
    }
  }
})

module.exports = router

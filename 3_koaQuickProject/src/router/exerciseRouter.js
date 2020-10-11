const KoaRouter = require('koa-router')
const { ExerciseController } = require('../controller/ExerciseController')


const router = new KoaRouter()

router.prefix('/exercise')

router.get('/pic', async ctx => {
  // console.log(ExerciseController)
  const picArr = ExerciseController.getPicArr()
  ctx.body = {
    errorCode: 0,
    msg: 'ok',
    data: picArr
  }
})

module.exports = router

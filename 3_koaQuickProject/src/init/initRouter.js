const path = require('path')

const requireDirectory = require('require-directory')
const KoaRouter = require('koa-router')


function initRouter (app) {
  const afterRouterLoaded = (obj) => {
    if (obj instanceof KoaRouter) {
      app.use(obj.routes())
    }
  }

  requireDirectory(module, path.resolve(__dirname, '../router'), {
    visit: afterRouterLoaded
  })
}

module.exports = {
  initRouter
}

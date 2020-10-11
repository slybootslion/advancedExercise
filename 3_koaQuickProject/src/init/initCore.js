const koaCors = require('@koa/cors')

function initCors (app) {
  app.use(koaCors())
}

module.exports = {
  initCors
}

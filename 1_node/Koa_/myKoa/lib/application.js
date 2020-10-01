const http = require('http')
const Stream = require('stream')
const EventEmitter = require('events')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Application extends EventEmitter {
  constructor () {
    super()
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
    this.middlewares = []
  }

  use (fn) {
    this.middlewares.push(fn)
    // this.fn = fn
  }

  createContext (req, res) {
    const ctx = Object.create(this.context)
    const request = Object.create(this.request)
    const response = Object.create(this.response)

    ctx.request = request
    ctx.response = response
    ctx.request.req = ctx.req = req
    ctx.response.res = ctx.res = res

    return ctx
  }


  compose (ctx) {
    let index = -1
    const dispatch = (i) => {
      if (i <= index) return Promise.reject('next() called multiples')
      if (i === this.middlewares.length) return Promise.resolve() //终止条件
      index = i
      const middleware = this.middlewares[i]
      i++
      try {
        return Promise.resolve(middleware(ctx, () => dispatch(i)))
      } catch (e) {
        return Promise.reject(e)
      }
    }
    return dispatch(0)
  }

  handleRequest (req, res) {
    const ctx = this.createContext(req, res)
    res.statusCode = 404

    this.compose(ctx).then(() => {
      // this.fn(ctx)
      const { body } = ctx

      console.log('application',body)
      if (typeof body === 'string' || Buffer.isBuffer(body)) {
        res.end(body)
      } else if (body instanceof Stream) {
        // 默认是下载，注释掉了
        // res.setHeader('Content-Disposition', `attachement;filename=${encodeURIComponent('下载')}`)
        body.pipe(res)
      } else if (typeof body === 'object' && body !== null) {
        res.end(JSON.stringify(body))
      } else {
        res.end('Not Found')
      }
    }).catch(err => {
      this.emit('error', err)
    })

    this.on('error', () => {
      res.statusCode = 500
      res.end('Internal Error')
    })

  }

  listen (...args) {
    const port = args[0]
    const cb = args[1]
    const server = http.createServer(this.handleRequest.bind(this))
    server.listen(port, cb)
  }

}

module.exports = Application

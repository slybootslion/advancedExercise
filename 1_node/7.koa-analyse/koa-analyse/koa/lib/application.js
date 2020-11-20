const http = require('http')
const Stream = require('stream')
const EventEmitter = require('events')

const context = require('./context.js')
const request = require('./request.js')
const response = require('./response.js')

class Applications extends EventEmitter {
  constructor() {
    super()
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
    this.middlewares = []
  }

  use(fn) {
    this.middlewares.push(fn)
    // this.fn = fn
  }

  createContext(req, res) {
    const ctx = Object.create(this.context)
    const request = Object.create(this.request)
    const response = Object.create(this.response)
    ctx.request = request
    ctx.response = response
    ctx.request.req = ctx.req = req
    ctx.response.res = ctx.res = res
    return ctx
  }

  async compose(ctx) {
    let index = -1
    // 异步迭代用函数 同步迭代用循环
    const dispatch = (idx) => {
      if (idx <= index) return Promise.reject(new Error('next() called multiple times'))
      index = idx
      if (idx === this.middlewares.length) return Promise.resolve()
      const middleware = this.middlewares[idx]

      try {
        return Promise.resolve(middleware(ctx, () => dispatch(++idx)))
      } catch (err) {
        return Promise.reject(err)
      }
    }
    return dispatch(0)
  }

  handleRequest(req, res) {
    res.statusCode = 404
    const ctx = this.createContext(req, res)
    // this.fn(ctx)
    this.compose(ctx).then(() => {
      const body = ctx.body
      if (typeof body === 'string' || Buffer.isBuffer(body)) {
        res.end(body)
      } else if (body instanceof Stream) {
        body.pipe(res)
      } else if (typeof body === 'object' && body != null) {
        res.end(JSON.stringify(body))
      } else {
        res.end('Not Found')
      }
    }).catch(err => this.emit('error', err))

    this.on('error', () => {
      res.statusCode = 500
      res.end('Internal Server Error')
    })
  }

  listen(...args) {
    const server = http.createServer((...args) => this.handleRequest(...args))
    // 绑定this指向的另一种写法
    // const server = http.createServer(this.handleRequest.bind(this))
    server.listen(...args)
  }
}

module.exports = Applications

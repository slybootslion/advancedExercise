const http = require('http')
const Stream = require('stream')

const context = require('./context.js')
const request = require('./request.js')
const response = require('./response.js')

class Applications {
  constructor() {
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
  }

  use(fn) {
    this.fn = fn
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

  handleRequest(req, res) {
    res.statusCode = 404
    const ctx = this.createContext(req, res)
    this.fn(ctx)

    const body = ctx.body
    if (typeof body === 'string' || Buffer.isBuffer(body)) {
      res.end(ctx.body)
    } else if (body instanceof Stream) {
      body.pipe(res)
    } else if (typeof body === 'object' && body != null) { 
      res.end(JSON.stringify(body))
    }else {
      res.end('Not Found')
    }
  }

  listen(...args) {
    const server = http.createServer((...args) => this.handleRequest(...args))
    // 绑定this指向的另一种写法
    // const server = http.createServer(this.handleRequest.bind(this))
    server.listen(...args)
  }
}

module.exports = Applications

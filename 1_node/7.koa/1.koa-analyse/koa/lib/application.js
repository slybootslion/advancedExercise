const http = require('http')
const Stream = require('stream')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Application {
  constructor (cb) {
    // Object.create一般用于继承，可以继承原本的属性
    // 这里用户扩展到新创建的对象，不会影响原来的对象
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
  }

  use (fn) {
    this.fn = fn
  }

  createContext (req, res) {
    // 每次创建一个新的上下文，保证每次请求之间不干扰
    const ctx = Object.create(this.context)
    const request = Object.create(this.request)
    const response = Object.create(this.response)
    ctx.request = request
    ctx.response = response
    ctx.request.req = ctx.req = req
    ctx.response.res = ctx.res = res
    return ctx
  }

  handleRequest (req, res) {
    const ctx = this.createContext(req, res)
    res.statusCode = 404
    this.fn(ctx)
    const body = ctx.body
    if (typeof body === 'string' || Buffer.isBuffer(body)) {
      res.end(ctx.body)
    } else if (body instanceof Stream) {
      // 源码返回文件默认下载
      // res.setHeader('Content-Disposition', `attachement;filename=${encodeURIComponent('下载')}`)
      body.pipe(res)
    } else if (typeof body === 'object' && body != null) {
      res.end(JSON.stringify(body))
    } else {
      res.end('Not Found')
    }
  }

  listen (...args) {
    const server = http.createServer((...args) => this.handleRequest(...args))
    server.listen(...args)
  }
}

module.exports = Application

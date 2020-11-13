const http = require('http')
const Stream = require('stream')
const EventEmitter = require('events')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Application extends EventEmitter {
  constructor (cb) {
    super()
    // Object.create一般用于继承，可以继承原本的属性
    // 这里用户扩展到新创建的对象，不会影响原来的对象
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)

    this.middlewares = []
  }

  use (fn) {
    this.middlewares.push(fn)
  }

  createContext (req, res) {
    // 每次创建一个新的上下文，保证每次请求之间不干扰
    const ctx = Object.create(this.context)
    const request = Object.create(this.request)
    const response = Object.create(this.response)
    ctx.request = request // koa封装的
    ctx.response = response // koa封装的
    ctx.request.req = ctx.req = req // node自带
    ctx.response.res = ctx.res = res // node自带
    return ctx
  }

  /* koa中间件核心代码 */
  compose (ctx) {
    // dispatch就是next()函数
    let count = -1 // 防止next被调用多次
    const dispatch = async (c) => {
      if (count === c) return Promise.reject('next() called multiples')
      if (c === this.middlewares.length) return Promise.resolve()
      count = c
      const mw = this.middlewares[c]
      try {
        return Promise.resolve(mw(ctx, () => dispatch(++c)))
      } catch (e) {
        return Promise.reject(e)
      }
    }
    return dispatch(0)
  }

  handleRequest (req, res) {
    const ctx = this.createContext(req, res)
    res.statusCode = 404
    // this.fn(ctx)

    this.compose(ctx).then(() => {
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
    }).catch(err => {
      // 错误异常处理
      this.emit('error', err)
    })

    this.on('error', () => {
      res.statusCode = 500
      res.end('Internal Error')
    })
  }

  listen (...args) {
    const server = http.createServer((...args) => this.handleRequest(...args))
    server.listen(...args)
  }
}

module.exports = Application

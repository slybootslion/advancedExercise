/* 静态服务器实现 */
const http = require('http')
const path = require('path')
const url = require('url')
const fs = require('fs').promises
const { createReadStream } = require('fs')
const mime = require('mime')
const port = 10000

class StaticServer {
  async handleRequest (req, res) {
    const { pathname } = url.parse(req.url, true)
    let filePath = path.join(__dirname, pathname)
    try {
      const statObj = await fs.stat(filePath)
      if (statObj.isFile()) {
        // 最low的方法
        // const data = await fs.readFile(filePath)
        // res.end(data)

        // 可读流的方式
        res.setHeader('Content-Type', `${mime.getType(filePath)};charset=utf-8`) // 获取文件类型和解决乱码
        createReadStream(filePath).pipe(res)
      } else {
        // 文件夹
        filePath = path.join(filePath, 'index.html')
        await fs.access(filePath)
        res.setHeader('Content-Type', `text/html;charset=utf-8`)
        createReadStream(filePath).pipe(res)
      }
    } catch (err) {
      this.sendError(err, res)
    }
  }

  start (...args) {
    // 箭头函数解决handleRequest中this指向问题（this应该指向StaticServer，不是server实例）
    // const server = http.createServer(() => this.handleRequest())
    // 或者用bind
    const server = http.createServer(this.handleRequest.bind(this))
    server.listen(...args)
  }

  sendError (err, res) {
    res.statusCode = 404
    res.end('Not Found')
  }
}

(new StaticServer).start(port, () => console.log(`server start on port:${port}`))

const fs = require('fs')
const EventEmitter = require('events')

class ReadStream extends EventEmitter {
  constructor (path, options = {}) {
    super()
    this.path = path
    this.flags = options.flags || 'r'
    this.encoding = options.encoding || null
    this.mode = options.mode || 438
    this.start = options.start || 0
    this.end = options.end
    this.offset = this.start // 读取的偏移量 会发生变化
    if (typeof this.autoClose === 'undefined') {
      this.autoClose = true
    } else {
      this.autoClose = options.autoClose
    }
    this.highWaterMark = options.highWaterMark || 64 * 1024

    // 默认非流动模式 控制pause resume
    this.flowing = null

    this.open()

    this.on('newListener', type => {
      if (type === 'data') {
        this.read()
      }
    })
  }

  pause () {
    this.flowing = false
  }

  resume () {
    if (!this.flowing) {
      this.flowing = true
      this.read()
    }
  }

  open () {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        return this.emit('error', err)
      }
      // 保存文件描述符
      this.fd = fd
      this.emit('open', fd)
    })
  }

  read () {
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this.read())
    }

    const buffer = Buffer.alloc(this.highWaterMark)
    let howMuchToRead = Math.min((this.end - this.offset + 1), this.highWaterMark)
    fs.read(this.fd, buffer, 0, howMuchToRead, this.offset, (err, bytesRead) => {
      if (bytesRead) {
        this.offset += bytesRead
        this.emit('data', buffer.slice(0, bytesRead))
        if (this.flowing) {
          this.read()
        }
      } else {
        this.emit('end')
        if (this.autoClose) {
          fs.close(this.fd, () => {
            this.emit('close')
          })
        }
      }
    })
  }

}

module.exports = {
  ReadStream
}

// require实现
const fs = require('fs')
const path = require('path')
const vm = require('vm')

function Module (filename) {
  this.id = filename
  this.exports = {}
  this.path = path.dirname(filename)
}

Module.prototype.load = function () {
  // 加载时获取文件的后缀名，根据后缀名的不同，采用不同的策略加载
  const extension = path.extname(this.id)
  Module._extensions[extension](this)
}

Module._cache = {}

Module.wrapper = function (content) {
  return `(function (exports, require, module, __filename, __dirname) {${content}})`
}

Module._extensions = {}

Module._extensions['.js'] = function (module) {
  const content = fs.readFileSync(module.id, 'utf8')
  const str = Module.wrapper(content)
  const fn = vm.runInThisContext(str) // 字符串转成函数
  const exports = module.exports
  fn.call(exports, exports, myReq, module, module.id, module.path)
}

Module._extensions['.json'] = function (module) {
  const content = fs.readFileSync(module.id, 'utf8')
  module.exports = JSON.parse(content)
}

Module._resolveFilename = function (filename) {
  const filePath = path.resolve(__dirname, filename)
  const isExists = fs.existsSync(filePath)
  if (isExists) return filePath
  // 否则尝试添加js或者json后缀
  const keys = Reflect.ownKeys(Module._extensions)
  for (let i = 0; i < keys.length; i++) {
    const newFilePath = filePath + keys[i]
    if (fs.existsSync(newFilePath)) return newFilePath
  }

  throw new Error('module not found')
}


function myReq (filename) {
  const filePath = Module._resolveFilename(filename)
  // 判断缓存
  if (Module._cache[filePath]) {
    return Module._cache[filePath].exports
  }
  const module = new Module(filePath)
  Module._cache[filePath] = module
  module.load()
  return module.exports
}

const res = myReq('./exampleFile/example')
res.exampleFun()

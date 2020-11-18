// ctx和proto的关系
// ctx.__proto__.__proto__ = proto
const proto = {}

module.exports = proto

function defineGetter (target, key) {
  proto.__defineGetter__(key, function () {
    return this[target][key]
  })
}

function defineSetter (target, key) {
  proto.__defineSetter__(key, function (val) {
    this[target][key] = val
  })
}

// 代理实现
defineGetter('request', 'path')
defineGetter('request', 'method')
defineGetter('request', 'url')
defineGetter('request', 'get')
defineGetter('response', 'body')
defineGetter('response', 'set')
defineGetter('response', 'get')

defineSetter('response', 'body')

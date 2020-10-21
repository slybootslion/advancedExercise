Function.prototype.before = function (beforeFn, ...args) {
  return (...argsInner) => {
    beforeFn(...args)
    this(...argsInner)
  }
}

function fn () {
  console.log('source')
}

const newFn = fn.before(doBefore, '!')

function doBefore (done) {
  console.log('before do something' + done)
}

newFn()

/*
判断类型的方式：
1、typeof 判断基础类型，不能区分对象和null
2、constructor 判断构造函数
3、instanceof 判断原型的实例
4、Object.prototype.toString.call
* */

function isType (typing) {
  return function (val) {
    return Object.prototype.toString.call(val) === `[object ${typing}]`
  }
}

let utils = {}
const types = ['String', 'Number', 'Boolean']
types.forEach(method => utils[`is${method}`] = isType(method))

console.log(utils.isString('123'))
console.log(utils.isString(123))

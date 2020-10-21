// 通用柯里化函数
const curring = (fn, arr = []) => {
  let len = fn.length
  return function (...args) {
    let newArgs = [...arr, ...args]
    if (newArgs.length === len) {
      return fn(...newArgs)
    } else {
      return curring(fn, newArgs)
    }
  }
}

function sum (a, b, c, d, e) {
  return a + b + c + d + e
}

const sumFn = curring(sum)
console.log(sumFn(1)(2)(3)(4)(5))
console.log(sumFn(1)(2)(3, 4, 5))

function isType(typing,val) {
  return Object.prototype.toString.call(val) === `[object ${typing}]`
}

const newIsType = curring(isType)
const isString = newIsType('String')
const isNumber = newIsType('Number')
console.log(isNumber('num'))
console.log(isString('str'))

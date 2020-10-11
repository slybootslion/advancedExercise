function instanceOf (A, B) {
  B = B.prototype
  A = A.__proto__
  while (true) {
    if (A === null) return false
    if (A === B) return true
    A = A.__proto__
  }
}

// 覆写校验string
class ValidateStr {
  static [Symbol.hasInstance] (x) {
    return typeof x === 'string'
  }
}

console.log('str' instanceof ValidateStr)

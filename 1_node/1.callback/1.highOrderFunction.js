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
  console.log( 'before do something' + done)
}

newFn()

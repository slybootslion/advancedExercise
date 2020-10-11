Function.prototype.myCall1 = function (context) {
  context = context ? Object(context) : window
  context.fn = this
  let args = []
  for (let i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }
  let r = eval('context.fn(' + args + ')')
  delete context.fn
  return r
}

Function.prototype.myCall2 = function (context, ...args) {
  context = context ? Object(context) : window
  context.fn = this
  const res = context.fn(...args)
  delete context.fn
  return res
}

Function.prototype.myApply1 = function (context, args) {
  context = context ? Object(context) : window
  context.fn = this
  if (!args) return context.fn()

  let r = eval('context.fn(' + args + ')')
  delete context.fn
  return r
}

Function.prototype.myApply2 = function (context, args) {
  context = context ? Object(context) : window
  context.fn = this
  const res = context.fn(...args)
  delete context.fn
  return res
}


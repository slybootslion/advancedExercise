Function.prototype.myBind = function (context) {
  let that = this
  let bindArgs = Array.prototype.slice.call(arguments, 1)
  function Fn () {}
  function fBound() {
    let args = Array.prototype.slice.call(arguments)
    return that.apply(this instanceof fBound ? this : context, bindArgs)
  }
  Fn.prototype = this.prototype
  fBound.prototype = new Fn()
  return fBound
}

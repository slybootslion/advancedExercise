function mockNew () {
  let Constructor = [].shift.call(arguments)
  let obj = {}
  obj.__proto__ = Constructor.prototype
  let r = Constructor.apply(obj, arguments)
  return r instanceof Object ? r : obj
}

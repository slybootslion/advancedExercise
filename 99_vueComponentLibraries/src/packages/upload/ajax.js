export default function ajax (options) {
  const xhr = new XMLHttpRequest()
  const action = options.action
  const fd = new FormData()
  fd.append(options.filename, options.file)
  // 错误
  xhr.onerror = function (err) {
    options.onError(err)
  }
  xhr.onload = function () {
    const text = xhr.responseText || xhr.response
    options.onSuccess(JSON.parse(text))
  }
  xhr.upload.onprogress = function (e) {
    if (e.total > 0) {
      e.percnet = e.loaded / e.total * 100
    }
    options.opProgress(e)
  }
  xhr.open('post', action, true)
  xhr.send(fd)
  return xhr
}

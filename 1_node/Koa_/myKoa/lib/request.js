const url = require('url')

module.exports = {
  get path() { // Object.defineProperty
    let {pathname} = url.parse(this.req.url)
    return pathname
  },
  get query() {
    let {query} = url.parse(this.req.url, true)
    return query
  },

}

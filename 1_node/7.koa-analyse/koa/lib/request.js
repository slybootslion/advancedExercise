const url = require('url')

module.exports = {
  get path () {
    // this === ctx.request
    const { pathname } = url.parse(this.req.url)
    return pathname
  },

  get query () {
    const { query } = url.parse(this.req.url, true)
    return query
  },

  get method () {
    return this.req.method
  },

  get header () {
    return this.req.headers;
  },

  set header (val) {
    this.req.headers = val;
  }
}

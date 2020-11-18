module.exports = {
  _body: undefined,
  get body () {
    return this._body
  },
  set body (val) {
    this.res.statusCode = 200
    this._body = val
  },
  set (field, val) {
    this.res.setHeader(field, val)
  },
  get (field) {
    const req = this.req;
    switch (field = field.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return req.headers.referrer || req.headers.referer || '';
      default:
        return req.headers[field] || '';
    }
  },
}

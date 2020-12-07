export default {
  functional: true,
  name: 'router-view',
  render(h, { data, parent }) {
    const route = parent.$route
    let idx = 0
    const records = route.match
    data.routerView = true
    while (parent) {
      if (parent.$vnode?.data?.routerView) {
        idx++
      }
      parent = parent.$parent
    }
    const record = records[idx]
    if (!record) return h()
    const t = h(record.component, data)
    console.log(t)
    return t
  },
}

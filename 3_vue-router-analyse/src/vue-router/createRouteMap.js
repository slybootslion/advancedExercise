function addRouteRecord(route, map, parent) {
  const path = parent ? (route.path.startsWith('/', 0) ? route.path : `${parent.path}/${route.path}`) : route.path
  const record = {
    path,
    parent,
    component: route.component,
    name: route.name,
    props: route.props,
    params: route.params || {},
    meta: route.meta,
  }

  if (!map[path]) {
    map[path] = record
  }

  if (route.children) {
    route.children.forEach(r => addRouteRecord(r, map, record))
  }
}

function createRouteMap(routes, oldPathMap) {
  // 1个参数初始化，2参数动态添加
  const map = oldPathMap || {}

  routes.forEach(route => addRouteRecord(route, map, null))

  return { pathMap: map }
}

export { createRouteMap }

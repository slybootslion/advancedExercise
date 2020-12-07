import { createRouteMap } from '@/vue-router/createRouteMap'

function createRoute(record, loaction) {
  const res = []

  if (record) {
    while (record) {
      res.unshift(record)
      record = record.parent
    }
  }

  return {
    ...location,
    match: res,
  }
}

function createMatcher(routes) {
  const { pathMap } = createRouteMap(routes)

  function addRouter(routes) {
    createRouteMap(routes, pathMap)
  }

  function match(path) {
    const record = pathMap[path]
    return createRoute(record, { path })
  }

  return {
    addRouter,
    match,
  }
}

export { createRoute, createMatcher }

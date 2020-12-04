import { createRouteMap } from '@/vue-router/createRouteMap'

function createMatcher(routes) {
  const { pathMap } = createRouteMap(routes)

  function addRouter(routes) {
    createRouteMap(routes, pathMap)
  }

  function match(path) {}

  return {
    addRouter,
    match,
  }
}

export { createMatcher }

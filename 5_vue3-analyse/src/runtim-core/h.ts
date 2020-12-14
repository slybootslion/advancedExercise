import { createVNode } from './createVNode'

function h(type, props, children) {
  return createVNode(type, props, children)
}

export { h }

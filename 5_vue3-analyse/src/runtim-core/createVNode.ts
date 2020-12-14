import { isArray, isObject, isString, ShapeFlags } from '../utils'

export function createVNode(type, props = {} as any, children = null) {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0

  // type
  const vNode = {
    type,
    props,
    children,
    component: null,
    el: null,
    key: props.key,
    shapeFlag,
  }

  if (isArray(children)) {
    // 组件
    vNode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  } else {
    // 文本
    vNode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }

  return vNode
}

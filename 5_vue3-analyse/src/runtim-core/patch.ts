import { ShapeFlags } from '../utils'
import { createComponentInstance, setupComponent, setupRenderEffect } from './component'

function mountElement(n2, container) {}

function patchElement(n1, n2, container) {}

function mountComponent(n2, container) {
  const instance = n2.component = createComponentInstance(n2)
  setupComponent(instance)
  setupRenderEffect(instance, n2, container)
}

function updateComponent(n1, n2, container) {}

function patch(n1, n2, container) {
  const { shapeFlag } = n2

  const processElement = (n1, n2, container) => {
    if (n1 == null) {
      mountElement(n2, container)
    } else {
      patchElement(n1, n2, container)
    }
  }

  const processComponent = (n1, n2, container) => {
    if (n1 == null) {
      mountComponent(n2, container)
    } else {
      updateComponent(n1, n2, container)
    }
  }

  // 不是元素
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(n1, n2, container)
  } else {
    processComponent(n1, n2, container)
  }
}

export { patch }

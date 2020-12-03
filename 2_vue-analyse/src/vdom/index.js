import { isObject, isReservedTag } from '../utils'

function createElement(vm, tag, data = {}, ...children) {
  if (isReservedTag(tag)) {
    return vNode(vm, tag, data, data.key, children, undefined)
  }
  // 组件 Ctor即Sub
  const Ctor = vm.$options.components[tag]
  return createComponent(vm, tag, data, data.key, children, Ctor)
}

function createTextVNode(vm, t) {
  return vNode(vm, undefined, undefined, undefined, undefined, t)
}

function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }
  // 组件添加生命周期
  data.hook = {
    init(vNode) {
      const child = vNode.componentInstance = new vNode.componentOpts.Ctor({})
      child.$mount()
    },
  }
  return vNode(vm, `vue-component-${tag + Ctor.cid}`, data, key, undefined, undefined, { Ctor })
}

function vNode(vm, tag, data, key, children, txt, componentOpts) {
  return { vm, tag, data, key, children, txt, componentOpts }
}


function isSameVNode(n1, n2) {
  return n1.tag === n2.tag && n1.key === n2.key
}

export { createElement, createTextVNode, isSameVNode }

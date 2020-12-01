function createElement(vm, tag, data = {}, ...children) {
  return vNode(vm, tag, data, data.key, children, undefined)
}

function createTextVNode(vm, t) {
  return vNode(vm, undefined, undefined, undefined, undefined, t)
}

function vNode(vm, tag, data, key, children, txt) {
  return { vm, tag, data, key, children, txt }
}

export { createElement, createTextVNode }

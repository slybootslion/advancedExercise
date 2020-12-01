function patch(oldVNode, vNode) {
  const isRealElement = oldVNode.nodeType
  if (isRealElement) {
    // 初次渲染
    const parentEl = oldVNode.parentNode
    const el = createEl(vNode)
    parentEl.insertBefore(el, oldVNode.nextSibling)
    parentEl.removeChild(oldVNode)
    return el
  } else {
  }
}

// 创建正式节点
function createEl(vNode) {
  const { vm, tag, children, key, data, txt } = vNode
  if (typeof tag === 'string') {
    // 真实节点 或 组件
    vNode.el = document.createElement(tag)
    updateProperties(vNode)
    children.forEach(child => {
      vNode.el.appendChild(createEl(child))
    })
  } else {
    // 文本节点
    vNode.el = document.createTextNode(txt)
  }
  return vNode.el
}

// 创建属性
function updateProperties(vNode) {
  const props = vNode.data || {}
  const el = vNode.el

  for (const propsKey in props) {
    if (props.hasOwnProperty(propsKey)) {
      const value = props[propsKey]
      if (propsKey === 'style') {
        for (const styleKey in props.style) {
          el.style[styleKey] = value[styleKey]
        }
      } else {
        el.setAttribute(propsKey, value)
      }
    }
  }
}

export { patch }
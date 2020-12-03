import { isSameVNode } from './index'

function patch(oldVNode, vNode) {
  if (!oldVNode) return createEl(vNode)
  const isRealElement = oldVNode.nodeType
  if (isRealElement) {
    // 初次渲染
    const parentEl = oldVNode.parentNode
    const el = createEl(vNode)
    parentEl.insertBefore(el, oldVNode.nextSibling)
    parentEl.removeChild(oldVNode)
    return el
  } else {
    // diff 两个虚拟节点的比对
    if (oldVNode.tag !== vNode.tag) {
      return oldVNode.el.parentNode.replaceChild(createEl(vNode), oldVNode.el)
    }
    if (!oldVNode.tag && oldVNode.txt !== vNode.txt) {
      return (oldVNode.el.textContent = vNode.txt)
    }
    const el = (vNode.el = oldVNode.el)
    updateProperties(vNode, oldVNode.data)

    // 子节点的比对
    const childrenOld = oldVNode.children || []
    const childrenNew = vNode.children || []
    if (childrenOld.length && childrenNew.length) {
      updateChildren(el, childrenOld, childrenNew)
    } else if (childrenOld.length) {
      el.innerHTML = ''
    } else if (childrenNew.length) {
      childrenNew.forEach(child => el.appendChild(createEl(child)))
    }
  }
}

// 判断是组件还是原始标签
function createComponent(vNode) {
  let i = vNode.data
  if ((i = i.hook) && (i = i.init)) i(vNode)
  return !!vNode.componentInstance
}

// 创建正式节点
function createEl(vNode) {
  const { vm, tag, children, key, data, txt } = vNode
  if (typeof tag === 'string') {
    // 真实节点 或 组件
    if (createComponent(vNode)) return vNode.componentInstance.$el

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
function updateProperties(vNode, oldProps = {}) {
  const props = vNode.data || {}
  const el = vNode.el

  // 老的属性新的没有（删除）
  for (const oldKey in oldProps) {
    if (!props[oldKey]) {
      el.removeAttribute(oldKey)
    }
  }

  // 样式特殊处理
  const styleNew = props.style || {}
  const styleOld = oldProps.style || {}
  for (const oldKey in styleOld) {
    if (!styleNew[oldKey]) {
      el.style[oldKey] = ''
    }
  }

  // 新的属性老的没有
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

function makeIndexByKey(oldChildren) {
  let map = {}
  oldChildren.forEach((child, idx) => (map[child.key] = idx))
  return map
}

// 更新子节点
function updateChildren(el, childrenOld, childrenNew) {
  let oldStartIndex = 0
  let oldEndIndex = childrenOld.length - 1
  let oldStartVNode = childrenOld[0]
  let oldEndVNode = childrenOld[oldEndIndex]

  let newStartIndex = 0
  let newEndIndex = childrenNew.length - 1
  let newStartVNode = childrenNew[0]
  let newEndVNode = childrenNew[newEndIndex]

  const map = makeIndexByKey(childrenOld)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (oldStartVNode == null) {
      oldStartVNode = childrenOld[++oldStartIndex]
    } else if (oldEndVNode == null) {
      oldEndVNode = childrenOld[--oldEndIndex]
    } else if (isSameVNode(oldStartVNode, newStartVNode)) {
      patch(oldStartVNode, newStartVNode)
      oldStartVNode = childrenOld[++oldStartIndex]
      newStartVNode = childrenNew[++newStartIndex]
    } else if (isSameVNode(oldEndVNode, newEndVNode)) {
      patch(oldEndVNode, newEndVNode)
      oldEndVNode = childrenOld[--oldEndIndex]
      newEndVNode = childrenNew[--newEndIndex]
    } else if (isSameVNode(oldStartVNode, newEndVNode)) {
      patch(oldStartVNode, newEndVNode)
      el.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling)
      oldStartVNode = childrenOld[++oldStartIndex]
      newEndVNode = childrenNew[--newEndIndex]
    } else if (isSameVNode(oldEndVNode, newStartVNode)) {
      patch(oldEndVNode, newStartVNode)
      el.insertBefore(oldEndVNode.el, oldStartVNode.el)
      oldEndVNode = childrenOld[--oldEndIndex]
      newStartVNode = childrenNew[++newStartIndex]
    } else {
      const moveIndex = map[newStartVNode.key]
      if (moveIndex == null) {
        el.insertBefore(createEl(newStartVNode), oldStartVNode.el)
      } else {
        const moveVNode = childrenOld[moveIndex]
        childrenOld[moveIndex] = null
        if (!moveVNode.el) return
        el.insertBefore(moveVNode.el, oldStartVNode.el)
        patch(moveVNode, newStartVNode)
      }
      newStartVNode = childrenNew[++newStartIndex]
    }
  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      const nextEl = childrenNew[newEndIndex + 1] == null ? null : childrenNew[newEndIndex + 1].el
      // el.appendChild(createEl(childrenNew[i]))
      // 如果insertBefore==null相当于appendChild
      el.insertBefore(createEl(childrenNew[i]), nextEl)
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const child = childrenOld[i]
      if (child != null) el.removeChild(child.el)
    }
  }
}

export { patch, createEl }

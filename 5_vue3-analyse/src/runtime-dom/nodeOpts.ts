const nodeOpts = {
  createElement(type) {
    return document.createElement(type)
  },

  inset(child, parent, anchor = null) {
    parent.insertBefore(child, anchor)
  },

  remove(child) {
    const parent = child.parentNode
    if (parent) parent.removeChild(child)
  },

  setElementText(el, content) {
    el.textContent = content
  },

  createTextNode(data: string): Text {
    return document.createTextNode(data)
  },
}
export { nodeOpts }

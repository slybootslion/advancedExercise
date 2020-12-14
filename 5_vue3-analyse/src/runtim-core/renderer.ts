import { apiCreateApp } from './apiCreateApp'
import { patch } from './patch'

function createRender(options) {
  const render = (vNode, container) => {
    // 初次渲染
    patch(null, vNode, container)
  }

  return {
    createApp: apiCreateApp(render),
  }
}

export { createRender }

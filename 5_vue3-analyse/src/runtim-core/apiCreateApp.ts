import { createVNode } from './createVNode'

function apiCreateApp(render) {
  return component => {
    const app = {
      mount: container => {
        const vNode = createVNode(component)
        render(vNode, container)
      },
    }

    return app
  }
}

export { apiCreateApp }

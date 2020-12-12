import { createRender } from '../runtim-core'
import { nodeOpts } from './nodeOpts'
import { patchProp } from './patchProp'

function ensureRender() {
  return createRender({ ...nodeOpts, patchProp })
}

function createApp(rootComponent) {
  // rootComponent = app
  const app = ensureRender().createApp(rootComponent)
  const { mount } = app
  app.mount = function (el) {
    el = typeof el === 'string' ? document.querySelector(el) : el
    el.innerHTML = ''
    mount(el)
  }
  return {
    mount,
  }
}

export { createApp }

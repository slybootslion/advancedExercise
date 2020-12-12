import { apiCreateApp } from './apiCreateApp'

function createRender(options) {

  const render = () => {}
  return {
    createApp: apiCreateApp(render),
  }
}

export { createRender }

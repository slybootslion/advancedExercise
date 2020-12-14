import { isFunction } from '../utils'
import { effect } from '../reactivity'

function createComponentInstance(vNode) {
  const instance = {
    type: vNode.type,
    props: {},
    subTree: null,
    vNode,
    render: null,
    setupState: null,
    isMounted: false,
  }

  return instance
}

function setupComponent(instance) {
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  let { setup } = instance.type
  if (setup) {
    const setupResult = setup(instance.props)
    return handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
  if (isFunction(setupResult)) {
    instance.render = setupResult
  } else {
    instance.setupState = setupResult
  }
}

function setupRenderEffect(instance, vNode, container) {
  effect(() => {
    if (!instance.isMounted) {
      // 组件没有挂载，初始化
      console.log(instance.render())
    } else {
      // 组件更新
    }
  })
}

export { createComponentInstance, setupComponent, setupRenderEffect }

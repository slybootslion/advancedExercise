const effectStack: Function[] = []

function createReactiveEffect(fun) {
  const effect = function () {
    effectStack.push(effect)
    fun()
  }
  return effect
}

function effect(fun, opts = {}) {
  const effect = createReactiveEffect(fun)
  effect()
}

export {
  effect,
  effectStack
}

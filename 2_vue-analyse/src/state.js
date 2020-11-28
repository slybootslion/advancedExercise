import { observe } from './observer/index'

function initState(vm) {
  // 将所有的数据定义在vm上，后续更改时，触发试图的更新
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(nValue) {
      vm[source][key] = nValue
    },
  })
}

function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data

  for (const dataKey in data) {
    proxy(vm, '_data', dataKey)
  }

  // 观测数据
  observe(data)
}

export { initState }

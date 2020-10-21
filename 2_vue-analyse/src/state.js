import { observe } from "./observer/index";

function proxy (vm, souce, key) {
  Object.defineProperty(vm, key, {
    get () {
      return vm[souce][key]
    },
    set (newValue) {
      vm[souce][key] = newValue
    }
  })
}

function initData (vm) {
  let data = vm.$opitions.data
  // 通过vm._data获取劫持后的数据
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  // 将_data中的值放在实例上（vm）
  for (const key in data) {
    proxy(vm, '_data', key)
  }

  observe(data)
}

export function initState (vm) {
  const opts = vm.$opitions
  // 初始化的数据
  if (opts.data) {
    initData(vm)
  }
}

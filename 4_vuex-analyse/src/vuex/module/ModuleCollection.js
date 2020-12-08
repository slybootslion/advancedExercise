import { forEachValue } from '@/vuex/utils'
import { Module } from '@/vuex/module/Module'

class ModuleCollection {
  constructor(options) {
    this.root = null
    this.register([], options)
  }

  register(path, rootModule) {
    const module = new Module(rootModule)

    if (!path.length) {
      this.root = module
    } else {
      const parent = path.slice(0, -1).reduce((pre, cur) => pre.getChild(cur), this.root)
      parent.setChild(path[path.length - 1], module)
    }

    if (rootModule.modules) {
      forEachValue(rootModule.modules, (moduleName, module) => {
        this.register(path.concat(moduleName), module)
      })
    }
  }

  getNamespace(path) {
    let module = this.root
    return path.reduce((namespace, key) => {
      module = module.getChild(key)
      return namespace + (module.namespace ? key + '/' : '')
    }, '')
  }
}

export { ModuleCollection }

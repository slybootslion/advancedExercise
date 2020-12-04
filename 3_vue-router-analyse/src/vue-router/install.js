let _Vue

function install(Vue, options) {
  _Vue = Vue

  Vue.mixin({
    beforeCreate() {
      // 获取每个组件的实例，给实例添加router属性
      if (this.$options.router) {
        // this ---> 根实例(new Vue())
        this._routerRoot = this
        // this.$options.router ---> new VueRouter()
        this._router = this.$options.router
        this._router.init(this)
      } else {
        // 实例一层层传递给子组件
        this._routerRoot = this.$parent?._routerRoot
      }
    },
  })
}

export { install, _Vue }

import routerLink from './components/router-link'
import routerView from './components/router-view'

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
        // 将base中history的current变成响应式的
        Vue.util.defineReactive(this, '_route', this._router.history.current)
        console.log(this._route)
      } else {
        // 实例一层层传递给子组件
        this._routerRoot = this.$parent?._routerRoot
      }
    },
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route // current属性，有path、matched等
    },
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router // history，路由方法：push，match，addRoute
    },
  })

  Vue.component('router-link', routerLink)
  Vue.component('router-view', routerView)
}

export { install, _Vue }

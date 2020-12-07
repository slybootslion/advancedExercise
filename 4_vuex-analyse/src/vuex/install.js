let _Vue

function install(Vue, options) {
  _Vue = Vue
  Vue.mixin({
    beforeCreate: vuexInit,
  })
}

function vuexInit() {
  if (this.$options.store) {
    this.$store = this.$options.store
  } else if (this.$parent?.$store) {
    this.$store = this.$parent.$store
  }
}

export { install, _Vue }

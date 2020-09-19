<template>
  <div class="container">
    <h1>自定义指令</h1>
    <div>
      <button v-h1-click="hide">click this hide txt</button>
      <div v-if="hideDom">hide this txt</div>
      <input type="text" v-focus="true" placeholder="自动获取焦点">
    </div>

    <p style="margin-top: 40px;">
      <router-link to="/">home</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'CustomDirectives',
  data () {
    return {
      hideDom: true
    }
  },
  methods: {
    hide () {
      this.hideDom = false
    },
    show () {
      this.hideDom = true
    }
  },
  directives: {
    focus: {
      inserted (el, binding, vnode) {
        el.focus()
      }
    },
    h1Click: {
      bind (el, binding, vnode) {
        el.handler = function (e) {
          if (e.target.tagName.toLowerCase() === 'button') {
            const method = binding.expression
            vnode.context[method]()
            return false
          }
          vnode.context.show()
        }
        document.addEventListener('click', el.handler)
      },
      unbind (el) {
        document.removeEventListener('click', el.handler)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  //@import "style/public";
</style>

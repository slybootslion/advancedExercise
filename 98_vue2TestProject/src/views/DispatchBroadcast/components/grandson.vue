<template>
  <div>
    <button @click="trigger">触发dispatch组件的方法</button>
  </div>
</template>

<script>
export default {
  name: 'grandson-comp-dispatch',
  methods: {
    trigger () {
      this.$dispatch('eat', ['Dispatch', 'Son2-comp'], '饭')
    },
    drink (value) {
      console.log('grandson' + value)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  //@import "style/public";
</style>

<template>
  <div>
    <grandson-comp-dispatch/>
  </div>
</template>

<script>
import GrandsonCompDispatch from './grandson'

export default {
  name: 'Son2-comp',
  components: { GrandsonCompDispatch },
  methods: {
    eat (value) {
      console.log('son2吃' + value)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  //@import "style/public";
</style>

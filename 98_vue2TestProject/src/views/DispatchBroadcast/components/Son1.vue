<template>
  <div>
    <grandson-comp-dispatch />
  </div>
</template>

<script>
import GrandsonCompDispatch from './grandson'
export default {
  name: 'Son1-comp',
  components: { GrandsonCompDispatch }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  //@import "style/public";
</style>

<template>
  <div>
    <grandson-comp />
  </div>
</template>

<script>
import GrandsonComp from './grandson'
export default {
  name: 'son1-comp',
  components: { GrandsonComp }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  //@import "style/public";
</style>

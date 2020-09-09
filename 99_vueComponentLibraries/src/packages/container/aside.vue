<template>
  <div class="zh-aside" :style="{width}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'zh-aside',
  props: {
    width: {
      type: String,
      default: '300px'
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  //@import "style/public";
</style>

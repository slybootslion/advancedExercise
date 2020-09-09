<template>
  <div class="zh-main">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'zh-main'
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .zh-main {
    flex: 1;
    padding: 20px;
  }
</style>

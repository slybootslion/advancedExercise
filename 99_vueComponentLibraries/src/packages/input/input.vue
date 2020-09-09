<template>
  <div>
    <input type="text">
  </div>
</template>

<script>
export default {
  name: 'zh-input',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    value: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  //@import "style/public";
</style>

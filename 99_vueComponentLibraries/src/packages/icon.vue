<template>
  <svg class="zh-icon" :style="{width: `${size}px`, height: `${size}px`}" aria-hidden="true">
    <use :xlink:href="`#icon-${icon}`"></use>
  </svg>
</template>

<script>
import '../styles/iconfont'

export default {
  name: 'zh-icon',
  props: {
    icon: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 25
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  //@import "style/public";
  .zh-icon {
    vertical-align: middle;
  }
</style>

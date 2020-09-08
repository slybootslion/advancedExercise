<template>
  <div class="zh-button-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'zh-button-group',
  mounted () {
    const children = this.$el.children
    const len = children.length
    for (let i = 0; i < len; i++) {
      console.assert(children[i].tagName === 'BUTTON', '子元素必须是一个button')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../styles/_var.scss';

  .zh-button-group {
    display: inline-flex;
    vertical-align: middle;

    button {
      border-radius: 0;
      position: relative;

      &:not(first-child) {
        margin-left: -1px;
      }

      &:first-child {
        border-top-left-radius: $border-radius;
        border-bottom-left-radius: $border-radius;
      }

      &:last-child {
        border-top-right-radius: $border-radius;
        border-bottom-right-radius: $border-radius;
      }

      &:hover{
        z-index: 1;
      }

      &:focus{
        z-index: 2;
      }
    }
  }

</style>

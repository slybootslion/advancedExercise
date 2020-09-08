<template>
  <button class="zh-button">
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'zh-button',
  props: {
    type: {
      type: String,
      default: '',
      validator (type) {
        if (type && !['warning', 'success', 'danger', 'info', 'primary'].includes(type)) {
          console.error("type类型必须为： 'warning', 'success', 'danger', 'info', 'primary'")
        }
        return true
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../styles/_var.scss';

  $height: 42px;
  $font-size: 16px;
  $color: #606266;
  $border-color: #dcdfe6;
  $background: #ecf5ff;
  $active-color: #3a8ee6;

  .zh-button {
    height: $height;
    border-radius: $border-radius;
    border: 1px solid $border-color;
    line-height: 1;
    font-size: $font-size;
    cursor: pointer;
    padding: 12px 20px;
    display: inline-flex;
    justify-content: center;
    vertical-align: middle;
    user-select: none;

    &:hover {
      border-color: $border-color;
      background-color: $background;
    }

    &:focus, &:active {
      color: $active-color;
      border-color: $active-color;
      background-color: $background;
      outline: none;
    }

  }
</style>

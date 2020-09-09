<template>
  <div class="zh-row" :style="rowStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'zh-row',
  props: {
    gutter: {
      type: Number,
      default: 0
    }
  },
  computed: {
    rowStyle () {
      let style = {}
      if (this.gutter) {
        style = {
          ...style
          // marginLeft: -this.gutter / 2 + 'px'
          // marginRight: -this.gutter / 2 + 'px'
        }
      }
      return style
    }
  },
  mounted () {
    const cols = this.$children
    cols.forEach(child => {
      child.gutter = this.gutter
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .zh-row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
</style>

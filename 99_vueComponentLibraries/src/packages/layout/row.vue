<template>
  <div class="zh-row" ref="zhRow" :style="rowStyle">
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
    },
    justify: {
      type: String,
      validator (type) {
        if (type && !['start', 'end', 'center', 'space-around', 'space-between'].includes(type)) {
          console.error('类型必须是：start, end, center, space-around, space-between')
        }
        return true
      }
    }
  },
  computed: {
    rowStyle () {
      let style = {}
      if (this.gutter) {
        style = {
          ...style,
          marginLeft: -this.gutter / 2 + 'px',
          marginRight: -this.gutter / 2 + 'px'
        }
      }

      if (this.justify) {
        const key = ['start', 'end'].includes(this.justify) ? 'flex-' + this.justify : this.justify

        style = {
          ...style,
          justifyContent: key
        }

        return style
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

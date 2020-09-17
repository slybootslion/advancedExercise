<template>
  <div class="zh-progress">
    <div class="bar">
      <div class="bar-outer" :style="{height: storkeWidth + 'px'}">
        <div class="bar-inner" :style="barStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'zh-progress',
  props: {
    strokeWidth: {
      type: Number,
      default: 6
    },
    percentage: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: 'blue'
    }
  },
  computed: {
    barStyle () {
      const style = {}
      style.width = this.percentage + '%'
      style.background = this.color
      return style
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .bar {
    .bar-outer {
      border-radius: 100px;
      background: #eee;
      position: relative;
      vertical-align: middle;
    }

    .bar-inner {
      transition: width .6s ease;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
    }
  }
</style>

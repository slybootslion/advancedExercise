<template>
  <div>
    <div class="dialog" v-if="isShow">
      假装是一个弹框
    </div>
  </div>
</template>

<script>
export default {
  name: 'zh-dialog',
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    change () {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>

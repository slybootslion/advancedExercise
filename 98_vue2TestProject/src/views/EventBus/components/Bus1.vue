<template>
  <div>Bus1</div>
</template>

<script>
export default {
  name: 'Bus1-comp',
  mounted () {
    this.$bus.$on('parentMountedEvent', (e) => {
      console.log('父组件 mounted() OK 了', e)
    })
    this.$bus.$on('bus1Fn', () => {
      this.bus1()
    })
  },
  beforeDestroy () {
    this.$bus.$off('parentMountedEvent')
  },
  methods: {
    bus1 () {
      console.log('bus1 methods fn')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  //@import "style/public";
</style>

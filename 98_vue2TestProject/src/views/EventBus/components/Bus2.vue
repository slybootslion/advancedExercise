<template>
  <div>
    Bus2
    <p>
      <button @click="triggerBus1Fn">出发bus1中的方法</button>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Bus2-comp',
  mounted () {
    this.$bus.$on('parentMountedEvent', (e) => {
      console.log(e)
    })
  },
  methods: {
    triggerBus1Fn () {
      this.$bus.$emit('bus1Fn')
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  //@import "style/public";
</style>

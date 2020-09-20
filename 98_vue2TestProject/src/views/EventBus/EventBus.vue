<template>
  <div>
    <div class="view">
      <Bus1Comp class="bus"></Bus1Comp>
      <Bus2Comp class="bus"></Bus2Comp>
    </div>
    <p style="margin-top: 40px;">
      <router-link to="/">home</router-link>
    </p>
  </div>
</template>

<script>
import Bus1Comp from './components/Bus1'
import Bus2Comp from './components/Bus2'
export default {
  name: 'EventBus',
  components: { Bus2Comp, Bus1Comp },
  data () {
    return {
      busData: 'parent data'
    }
  },
  mounted () {
    this.$bus.$emit('parentMountedEvent', this.busData)
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .view {
    width: 450px;
    height: 680px;
    border: 1px solid #ededed;
    display: flex;

    .bus {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>

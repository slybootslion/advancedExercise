<template>
  <div>
    <div class="view">
      <Son1Comp class="bus"></Son1Comp>
      <Son2Comp class="bus"></Son2Comp>
      <div class="box">
        <button @click="trigger">触发grand son中的方法</button>
      </div>
    </div>
    <p style="margin-top: 40px;">
      <router-link to="/">home</router-link>
    </p>
  </div>
</template>

<script>
import Son1Comp from './components/Son1'
import Son2Comp from './components/Son2'

export default {
  name: 'Dispatch',
  components: { Son2Comp, Son1Comp },
  methods: {
    eat (value) {
      console.log('吃' + value)
    },
    trigger () {
      this.$broadcast('drink', 'Son1-comp > grandson-comp-dispatch', '水')
    }
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

  .box {
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

<template>
  <div>
    <div class="box">
      <p>子组件：{{prov.number}}</p>
      <button @click="change">更改父组件数字</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'grandson-comp',
  inject: ['prov'],
  methods: {
    change () {
      this.prov.changeNum(600)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .box {
    width: 200px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border: 1px solid #ededed;
  }
</style>

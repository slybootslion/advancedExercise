<template>
  <div>
    <div class="container">
      <div class="view">
        <p>父组件：{{number}}</p>
        <son1-comp class="bus"/>
      </div>
    </div>
    <p style="margin-top: 40px;">
      <router-link to="/">home</router-link>
    </p>
  </div>
</template>

<script>
import Son1Comp from './components/son1'

export default {
  name: 'ProvideInject',
  components: { Son1Comp },
  provide () {
    return {
      prov: this
    }
  },
  data () {
    return {
      number: 100
    }
  },
  mounted () {
    setTimeout(() => {
      this.number = 300
    }, 6000)
  },
  methods: {
    changeNum (num) {
      this.number = num
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .container {
    display: flex;

    .view {
      width: 450px;
      height: 680px;
      border: 1px solid #ededed;
      display: flex;
      flex-direction: column;
      margin-right: 10px;

      .bus {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>

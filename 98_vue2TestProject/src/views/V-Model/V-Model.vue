<template>
  <div>
    <div class="container">
      <div class="view">
        <Son1CompVmodel class="bus" :value="num" @input="val => num = val" />
        <Son1CompVmodel class="bus" v-model="num" />

        <!--自定义 v-model 语法糖-->
        <Son1CompVmodel class="bus" v-model="number" />
      </div>

      <div class="view">
        <p>.sync</p>
        <Son1CompVmodel class="bus" :number="n" @update:number="val => n = val" />
        <Son1CompVmodel class="bus" :number.sync="n"></Son1CompVmodel>
      </div>
    </div>
    <p style="margin-top: 40px;">
      <router-link to="/">home</router-link>
    </p>
  </div>
</template>

<script>
import Son1CompVmodel from './components/Son1'

export default {
  name: 'V-Model',
  components: { Son1CompVmodel },
  data () {
    return {
      num: 100,
      number: 100,
      n: 500
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

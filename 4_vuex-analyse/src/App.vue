<template>
  <div id="app">
    <p>--------基础使用-------</p>
    <div>使用的搜索引擎：{{ $store.state.name }}</div>
    <comp1></comp1>
    <button @click="commitFn">修改搜索引擎</button>
    <button @click="dispatchFn">增加年龄（异步）</button>

    <p>--------模块化-------</p>
    <div>在家里使用的搜索引擎：{{$store.state.home.name}}</div>
    <div>家的年龄：{{$store.state.home.age}}</div>
    <div>在公司使用的搜索引擎：{{$store.state.company.name}}</div>
    <div>公司年龄：{{$store.state.company.age}}</div>
    <button @click="commitModelFn">修改公司模块搜索引擎</button>
    <button @click="dispatchModelFn">增加公司模块年龄（异步）</button>
  </div>
</template>

<script>
import Comp1 from "@/components/comp1";

export default {
  name: 'App',
  components: { Comp1 },
  methods: {
    commitFn () {
      this.$store.commit('changeName', 'google')
    },
    dispatchFn () {
      this.$store.dispatch('addAge', 1)
    },
    commitModelFn () {
      this.$store.commit('company/changeName', 'google')
    },
    dispatchModelFn () {
      this.$store.dispatch('company/addAge', 1)
    }
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

button {
  margin-right: 20px;
}
</style>

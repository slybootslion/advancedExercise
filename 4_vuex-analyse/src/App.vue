<template>
  <div id="app">
    <div>使用的搜索引擎：{{ $store.state.name }}</div>
    <comp1></comp1>
    <!--    <button @click="$store.state.name = 'google'">change</button>-->
  </div>
</template>

<script>
import Comp1 from "@/components/comp1";

export default {
  name: 'App',
  components: { Comp1 }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
</style>

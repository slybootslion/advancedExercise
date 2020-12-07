<template>
  <div>
    <p>组件中的显示年龄：{{ $store.state.age }}</p>
    <p>getter中的年龄：{{ $store.getters.pcAge }}</p>
    <button @click="$store.state.age = $store.state.age + 1">add+</button>
  </div>
</template>

<script>
export default {
  name: 'comp1'
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

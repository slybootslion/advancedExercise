<template>
  <div>
    <router-link to="/about">about</router-link>
    <router-link to="custom-directives">CustomDirectives</router-link>
    <router-link to="transition">Transition</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
a {
  margin-left: 10px;
}
</style>

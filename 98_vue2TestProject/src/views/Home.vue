<template>
  <div>
    <router-link to="/about">about</router-link>
    <router-link to="/custom-directives">CustomDirectives</router-link>
    <router-link to="/transition">Transition</router-link>
    <router-link to="/event-bus">EventBus</router-link>
    <router-link to="/v-model">V-Model</router-link>
    <router-link to="/provide-inject">Provide/Inject</router-link>
    <router-link to="/dispatch">$dispatch/$broadcast</router-link>
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

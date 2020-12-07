<template>
  <div>
    <div>
      <router-link to="/b/b-a">b-a</router-link>
    </div>
    <div>
      <router-link to="/b/b-b">b-b</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'B-page'
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

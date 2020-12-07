<template>
  <div>
    <div class="clearFix">
      page b
      <div class="fl">
        <router-link to="/b/b-a">b-a</router-link>
      </div>
      <div class="fl">
        <router-link to="/b/b-b">b-b</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'B-page'
}
</script>

<style scoped>

</style>

<template>
  <div id="app">
    <div>
      <router-link to="/">a</router-link>
    </div>
    <div>
      <router-link to="/b">b</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>

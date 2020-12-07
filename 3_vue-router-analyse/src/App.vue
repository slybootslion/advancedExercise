<template>
  <div id="app">
    <div class="clearFix">
      <div class="fl">
        <router-link to="/">a</router-link>
      </div>
      <div class="fl">
        <router-link to="/b">b</router-link>
      </div>
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

.clearFix:after {
  content: '';
  clear: both;
  display: block;
}

.clearFix {
  zoom: 1;
}

.fl {
  float: left;
  margin-left: 20px;
  border-bottom: 1px solid #ededed;
}
</style>

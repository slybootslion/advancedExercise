<template>
  <div id="app">
    <zh-input v-model="value" type="text" placeholder="输入用户名" name="username"/>
    <zh-input v-model="value" type="password" placeholder="输入密码" name="password"/>
    {{value}}
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      value: ''
    }
  }
}
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }

  .green {
    color: #ffffff;
    background-color: green;
  }

  .red {
    color: #ffffff;
    background-color: red;
  }
</style>

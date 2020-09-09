<template>
  <div id="app">
    <zh-row>
      <zh-col :span="12">a</zh-col>
      <zh-col :span="12">b</zh-col>
    </zh-row>
    <zh-row>
      <zh-col :span="24">c</zh-col>
    </zh-row>

    <zh-row>
      <zh-col :span="6">a</zh-col>
      <zh-col :span="6" :offset="12">b</zh-col>
    </zh-row>

    <zh-row :gutter="20">
      <zh-col :span="6">
        <div class="green">a</div>
      </zh-col>
      <zh-col :span="6">
        <div class="red">b</div>
      </zh-col>
      <zh-col :span="6">
        <div class="green">c</div>
      </zh-col>
      <zh-col :span="6">
        <div class="red">d</div>
      </zh-col>
      <zh-col :span="6">
        <div class="red">d</div>
      </zh-col>
    </zh-row>

  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    fn (e) {
      console.log(e)
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

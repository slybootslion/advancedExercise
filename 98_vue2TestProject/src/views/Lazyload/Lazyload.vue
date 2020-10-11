<template>
  <div>
    <ul class="box">
      <li v-for="img in imgs" :key="img">
        <p></p>
        <img v-lazy="img" alt="">
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'Lazyload',
  data () {
    return {
      imgs: []
    }
  },
  mounted () {
    this.getPicArr()
  },
  methods: {
    async getPicArr () {
      const result = await this.$api.ExerciseApi.getPicArr()
      console.log(result)
      this.imgs = result
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .box {
    width: 300px;
    height: 300px;
    overflow: scroll;
  }

  .box img {
    width: 200px;
    height: auto;
  }
</style>

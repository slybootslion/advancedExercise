<template>
  <div>
    <div class="box">
      <p v-if="value">value：{{value}}</p>
      <p v-if="number">number：{{number}}</p>
      <button @click="change">change props</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Son1-comp-vmodel',
  props: {
    value: {
      type: Number,
      default: 0
    },
    number: {
      type: Number,
      default: 0
    }
  },
  model: {
    prop: 'number',
    event: 'change'
  },
  methods: {
    change () {
      if (this.value) {
        this.$emit('input', 300)
      } else {
        this.number === 500 ? this.$emit('update:number', 600) : this.$emit('change', 300)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .box {
    width: 200px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border: 1px solid #ededed;
  }
</style>

<template>
  <div class="zh-input" :class="inputClass">
    <input class="input"
           :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
           :placeholder="placeholder"
           :value="value"
           :name="name"
           :disabled="disabled"
           ref="input"
           @input="$emit('input', $event.target.value)">

    <zh-icon icon="guanbi1" :size="14.5" class="zh-icon" v-if="clearable && value"
             @click.native="$emit('input', '')"
             @mousedown.native.prevent/>
    <zh-icon icon="xinxi" :size="14.5" class="zh-icon" v-if="showPassword && value"
             @click.native="changeStatus"/>
  </div>
</template>

<script>
export default {
  name: 'zh-input',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      passwordVisible: false
    }
  },
  computed: {
    inputClass () {
      const classes = []
      if (this.clearable || this.showPassword) {
        classes.push('zh-input-suffix-icon')
      }
      return classes
    }
  },
  methods: {
    changeStatus () {
      this.passwordVisible = !this.passwordVisible
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../styles/_var.scss';

  .zh-input {
    display: inline-flex;
    position: relative;

    input {
      width: 150px;
      height: 42px;
      padding: 8px;
      border-radius: $border-radius;
      border: 1px solid $border-color;

      &:focus {
        border: 1px solid $primary;
        outline: none;
        box-shadow: inset -1px 0px 2px $primary, inset 1px 1px 1px $primary;
      }

      &[disabled] {
        cursor: not-allowed;
        background-color: #eeeeee;
      }
    }

    &.zh-input-suffix-icon {
      .input {
        padding: 0 25px 0 10px;
      }

      .zh-icon {
        position: absolute;
        right: 8px;
        top: 13px;
      }
    }
  }
</style>

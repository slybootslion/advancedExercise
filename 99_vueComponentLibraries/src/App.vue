<template>
  <div id="app">
    <zh-upload name="avatar"
               action="http://loacalhost:3000/upload"
               :file-list="fileList"
               :limit="3"
               accept="image/jpeg"
               :multiple="true"
               :on-exceed="handleExceed"
               :on-change="handleChange"
               :on-success="handleSuccess"
               :on-error="handleError"
               :on-progress="handleProgress"
    >
      <zh-button type="primary" icon="tabshouqi">点击上传</zh-button>
      <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </zh-upload>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      fileList: [
        { url: 'xxx', name: 'zfjg' },
        { url: 'xxx', name: 'zfjg' }
      ]
    }
  },
  methods: {
    handleExceed () {
    },
    handleChange () {
    },
    handleSuccess () {
    },
    handleError () {
    },
    handleProgress () {
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

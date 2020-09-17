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
               :before-upload="beforeUpload"
               :drag="true"
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
    handleExceed (files, fileList) {
      console.log('用户传递的已经超过预期')
    },
    handleChange (file) {
      console.log(file)
      console.log('当前更新了')
    },
    handleSuccess () {
    },
    handleError () {
    },
    handleProgress () {
    },
    beforeUpload (rawFile) {
      const limitSize = rawFile.size / 1024 > 500
      if (limitSize) {
        console.log('当前超过了最大限制')
        return false
      } else if (!rawFile.name.endsWith('.jpg')) {
        console.log('文件类型不对')
        return false
      }
      return true
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

<template>
  <div class="zh-upload">
    <div @click="handleClick" class="zh-upload-btn">
      <slot></slot>
    </div>
    <input type="file"
           class="input"
           :accept="accept"
           :multiple="multiple"
           :name="name"
           ref="input"
           @change="handleChange"
    />
    <div>
      <slot name="tip"></slot>
    </div>
  </div>
</template>

<script>
/*

 */

export default {
  name: 'zh-upload',
  props: {
    name: {
      type: String,
      default: 'file'
    },
    action: {
      type: String,
      required: true
    },
    fileList: {
      type: Array,
      default: () => []
    },
    accept: String,
    limit: Number,
    multiple: {
      type: Boolean,
      default: false
    },
    onExceed: Function,
    onChange: Function,
    onSuccess: Function,
    onError: Function,
    onProgress: Function
  },
  data () {
    return {
      tempIndex: 1
    }
  },
  methods: {
    handleClick () {
      const inputDom = this.$refs.input
      inputDom.value = ''
      inputDom.click()
    },
    handleChange (e) {
      const files = e.target.files
      this.uploadFiles(files)
    },
    uploadFiles (files) {
      if (this.limit && this.fileList.length + files.length > this.limit) {
        return this.onExceed && this.onExceed(files, this.fileList)
      }
      [...files].forEach(rawFile => {
        this.handleStart(rawFile) // 上传前的处理
        this.upload(rawFile) // 真正的上传
      })
    },
    handleStart (rawFile) {
      rawFile.uid = Math.random() + this.tempIndex++
      
    },
    upload (rawFile) {
      console.log(rawFile)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .zh-upload {
    .zh-upload-btn {
      display: inline-flex;
    }

    .input {
      display: none;
    }
  }
</style>

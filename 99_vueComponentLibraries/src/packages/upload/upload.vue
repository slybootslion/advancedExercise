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
import ajax from './ajax'

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
    onProgress: Function,
    beforeUpload: Function,
    httpRequest: {
      type: Function,
      default: () => ajax
    }
  },
  data () {
    return {
      tempIndex: 1,
      files: [], // 存储要展示的列表
      reqs: {} // 收集请求
    }
  },
  watch: {
    fileList: {
      immediate: true,
      handler (fileList) {
        this.files = fileList.map(item => {
          item.uid = Math.random() + this.tempIndex++
          item.status = 'success'
          return item
        })
      }
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
        this.upload(rawFile) // 上传前的校验
      })
    },
    handleStart (rawFile) {
      rawFile.uid = Math.random() + this.tempIndex++
      const file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      }
      // 将用户上传的当前文件push到列表中（上传后显示用）
      this.files.push(file)
      this.onChange && this.onChange(file)
    },
    upload (rawFile) {
      if (!this.beforeUpload) {
        // 直接上传
        return this.post(rawFile)
      }
      if (this.beforeUpload(rawFile)) {
        return this.post(rawFile)
      }
    },
    // 真正的上传
    post (rawFile) {
      const uid = rawFile.uid
      const options = {
        file: rawFile,
        filename: this.name,
        action: this.action,
        // 上传进度
        onProgress: ev => {
          this.handleProgress(ev, rawFile)
        },
        onSuccess: res => {
          this.handleSuccess(res, rawFile)
        },
        onError: err => {
          this.handleError(err, rawFile)
        }
      }

      const req = this.httpRequest(options)
      this.reqs[uid] = req
      if (req && req.then) {
        req.then(options.onSuccess, options.onError)
      }
    },
    getFile (rawFile) {
      return this.files.find(file => file.uid === rawFile.uid)
    },
    handleProgress (ev, rawFile) {
      // 获取格式化之后的文件
      const file = this.getFile(rawFile)
      file.status = 'uploading'
      file.percentage = ev.percent || 0
      this.onProgress && this.onProgress(ev, rawFile)
    },
    handleSuccess (rawFile) {
      const file = this.getFile(rawFile)
      console.log(file)
    },
    handleError () {

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

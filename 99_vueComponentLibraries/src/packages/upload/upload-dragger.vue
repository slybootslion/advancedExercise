<template>
  <div class="zh-upload-dragger"
       @drop.prevent="onDrop"
       @dragover.prevent
       @dragleave.prevent
  >
    <zh-icon icon="shoucang" :size="20"></zh-icon>
    <span class="text">将文件拖拽到此区域即可</span>
  </div>
</template>

<script>
export default {
  name: 'upload-dragger',
  methods: {
    onDrop (e) {
      if (!this.accpet) this.$emit('file', e.dataTransfer.files)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .zh-upload-dragger {
    width: 360px;
    height: 180px;
    border-radius: 10px;
    background-color: #eeeeee;
    border: 1px #aaa dashed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>

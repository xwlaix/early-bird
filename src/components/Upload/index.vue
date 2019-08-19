<template>
  <div>
    <el-form label-position="right" :class="type">
      <el-form-item>
        <span class="downLoad" style="color:#F56C6C;float:left;" @click="downLoad">模板格式下载</span>
      </el-form-item>
      <el-form-item>
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-change="handleChange"
          :http-request="upload"
          action
          class="form"
          style="display:inline-block;margin-top:15px;vertical-align: bottom;"
          drag
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>
        <el-button
          class="uploadFile"
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
        >上传到服务器</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { uploadFileFinally } from '@/utils'
import { MessageBox } from 'element-ui'

export default {
  props: {
    postUrl: {
      type: String,
      default: ''
    },
    downLoadUrl: {
      type: String,
      default: ''
    },
    listQuery: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  computed: {
    type() {
      return this.postUrl.replace('/import/', '')
    }
  },
  methods: {
    upload(param) {
      const loading = this.$loading({ target: `.${this.type}` })
      uploadFileFinally(this.postUrl, param, this.listQuery || {})
        .then(res => {
          const data = res.data
          this.$notify({
            type: +data.code === 1 ? 'success' : 'error',
            message: data.msg,
            duration: 2000
          })
          this.$emit('getTable', {
            list: +data.code === 1 ? data.data : [],
            url: this.postUrl
          })
          loading.close()
          if (data.code === 101) {
            MessageBox.confirm(
              '你已被登出，可以取消继续留在该页面，或者重新登录',
              '确定登出',
              {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(() => {
              this.$store.dispatch('user/resetToken').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            })
          }
        })
        .catch(() => {
          loading.close()
          this.$notify({
            type: 'error',
            message: '请求失败！',
            duration: 2000
          })
        })
    },
    submitUpload() {
      if (this.fileList.length > 0) {
        this.$refs.upload.submit()
      } else {
        this.$notify({
          type: 'error',
          message: '请上传excel',
          duration: 2000
        })
      }
    },
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        this.fileList = fileList.splice(0, 1)
      } else {
        this.fileList = fileList
      }
    },
    downLoad() {
      window.open(this.downLoadUrl, '_self')
    }
  }
}
</script>
<style scoped>
.form >>> .el-form-item {
  margin-bottom: 0 !important;
}
</style>


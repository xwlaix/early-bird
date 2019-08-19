<template>
  <div>
    <div class="title">市场负责人： <span style="color:red;font-size:12px;font-weight:normal">列表操作需要点击【确定】按钮才会提交数据保存</span></div>
    <div class="table-container">
      <el-button v-permission="['email:template:add']" class="filter-item left" size="small" type="primary" @click="handle">{{ status?'隐藏':'显示' }}</el-button>
      <div v-show="status" class="right">
        <el-select v-model="authorized_user_code" size="small" filterable placeholder="请选择市场负责人">
          <el-option
            v-for="item in authorizedUser"
            :key="item.contact_code"
            :label="item.user_name"
            :value="item.contact_code"
          />
        </el-select>
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      </div>
    </div>
    <iTable
      v-show="status"
      :data="marketAuthorizedUser"
      :col-configs="configs"
      :max-height="height"
      class="emailLog"
      row-key="id"
    >
      <el-table-column slot="operation" show-overflow-tooltip label="操作" min-width="200px" align="center">
        <template slot-scope="scope">
          <el-upload
            ref="upload"
            :limit="1"
            :file-list="fileList"
            :headers="headers"
            :on-error="handleError"
            :on-success="handleUpload"
            :before-upload="beforeUpload"
            :data="moreData"
            :action="uploadUrl"
            :show-file-list="false"
            name="user_authorized_pdf"
            class="form"
            style="display:inline-block;vertical-align: bottom;"
          >
            <el-button size="mini" type="warning" @click="getUploadId(scope.row.user_code)">上传</el-button>
          </el-upload>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="upload" show-overflow-tooltip label="授权文件" min-width="90px" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.authorized_file_path&&scope.row.authorized_file_path!='--'" size="mini" type="success" @click="getLook(scope.row.authorized_file_path)">预览</el-button>
        </template>
      </el-table-column>
    </iTable>
  </div>
</template>

<script>

import iTable from '@/components/Table'
import Cookies from 'js-cookie'

export default {
  components: { iTable },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    authorizedUser: {
      type: Array,
      default: function() {
        return []
      }
    },
    chargeCode: {
      type: String,
      default: ''
    },
    marketAuthorizedUser: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      height: 100,
      fileList: [],
      delete_user: [],
      uploadUrl: process.env.VUE_APP_BASE_API + '/market/upload',
      headers: {
        'authKey': Cookies.get('authKey'),
        'sessionId': Cookies.get('sessionId')
      },
      moreData: {
      },
      configs: [
        { slot: 'operation' },
        { prop: 'user_name', label: '用户名称', minWidth: '140px' },
        { prop: 'update_time', label: '最后修改时间', minWidth: '140px' },
        { slot: 'upload' }
      ],
      status: true,
      authorized_user_code: ''
    }
  },
  watch: {
    marketAuthorizedUser(val) {
      this.height = val.length * 41 + 46
    },
    dialogVisible(val) {
      this.delete_user = []
      this.authorized_user_code = ''
    }
  },
  created() {
    this.height = this.marketAuthorizedUser.length * 41 + 46
  },
  methods: {
    changeUser() {
      this.$emit('changeUser', { market_authorized_user: this.marketAuthorizedUser })
    },
    handleError() {
      this.$notify({
        type: 'error',
        message: '请求失败！',
        duration: 2000
      })
    },
    handleUpload(res, file) {
      if (res.code !== 200) {
        this.fileList = []
        this.$notify({
          type: 'error',
          message: res.msg,
          duration: 2000
        })
        return
      }
      for (const v of this.marketAuthorizedUser) {
        if (v.user_code === this.moreData.user_code) {
          const index = this.marketAuthorizedUser.indexOf(v)
          v.authorized_file_path = res.data
          this.marketAuthorizedUser.splice(index, 1, v)
          this.changeUser()
          break
        }
      }
    },
    beforeUpload(file) {
      const isPDF = file.type === 'application/pdf'
      if (!isPDF) {
        this.$message.error('上传的授权文件只能是 PDF 格式!')
      }
      return isPDF
    },
    getUploadId(user_code) {
      this.moreData.user_code = user_code
    },
    getLook(authorized_file_path) {
      // this.$router.push(`/#/pdf/index?src=${authorized_file_path}`)
      window.open(`/#/pdf/index?src=${authorized_file_path}`, '_blank')
    },
    handle() {
      this.status = !this.status
    },
    handleDelete(row) {
      this.$confirm(
        `此操作将删除该市场负责人, 是否继续?`,
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          for (const v of this.marketAuthorizedUser) {
            if (v.user_code === row.user_code) {
              const index = this.marketAuthorizedUser.indexOf(v)
              this.marketAuthorizedUser.splice(index, 1)
              if (!this.delete_user.includes(v)) {
                this.delete_user.push(v)
              }
              break
            }
          }
          this.changeUser()
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消',
            duration: 2000
          })
        })
    },
    handleAuthorized() {
      let user
      let flag = true
      for (const v of this.authorizedUser) {
        if (v.contact_code === this.authorized_user_code) {
          user = v
          break
        }
      }
      for (const v of this.delete_user) {
        if (v.user_code === user.contact_code) {
          // const index = this.marketAuthorizedUser.indexOf(v)
          // this.marketAuthorizedUser.splice(index, 1, v)
          this.marketAuthorizedUser.push(v)
          flag = false
          break
        }
      }
      if (flag) {
        this.marketAuthorizedUser.push({
          user_code: this.authorized_user_code,
          user_name: user.user_name
        })
      }
    },
    handleCreate() {
      if (!this.authorized_user_code) {
        this.$message.error('请先选择市场负责人！')
        return false
      }
      let flag = true
      for (const v of this.marketAuthorizedUser) {
        if (v.user_code === this.authorized_user_code) {
          flag = false
          break
        }
      }
      if (!flag) {
        this.$message.error('该市场负责人已经在列表中！')
        return false
      }
      if (this.chargeCode && this.chargeCode !== '--') {
        this.handleCharge()
      } else {
        this.handleAuthorized()
      }
    },
    handleCharge() {
      if (this.authorized_user_code === this.chargeCode) {
        this.$confirm(
          `选中的市场负责人已为应收账款负责人,此操作将在上传授权文件后删除应收账款负责人, 是否继续?`,
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            this.handleAuthorized()
          })
          .catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消',
              duration: 2000
            })
          })
      } else {
        this.handleAuthorized()
      }
    }
  }
}
</script>
<style scoped>
.title{
  font-size: 16px;
  font-weight: bold;
}
</style>


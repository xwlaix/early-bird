<template>
  <div>
    <div :class="{ active: status }" class="filter-container extend_container">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" class="form" label-width="220px">
        <el-form-item label="集团logo图">
          <el-upload :on-success="handleImgFront" :file-list="frontFileList" :show-file-list="false" :headers="headers" :on-error="handleError" :before-upload="beforeAvatarUpload" :data="moreData" :action="uploadUrl" name="logo" class="avatar-uploader">
            <el-image v-if="logo_status" :src="form.logo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="供应商激活介绍信" prop="supplier_introduction_file">
          <el-button v-if="form.supplier_introduction_file&&form.supplier_introduction_file!='-'" size="small" type="success" @click="getLook(form.supplier_introduction_file)">预览</el-button>
          <el-upload
            ref="upload"
            :limit="1"
            :file-list="fileList"
            :headers="headers"
            :on-error="handleError"
            :on-success="handleUpload"
            :before-upload="beforeUpload"
            :data="moreUploadData"
            :action="uploadPdfUrl"
            :show-file-list="false"
            name="user_authorized_pdf"
            class="form"
            style="display:inline-block;vertical-align: bottom;"
          >
            <el-button size="small" type="warning">{{ form.supplier_introduction_file&&form.supplier_introduction_file!='-'?'重新上传':'上传' }}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="二级域名前缀" prop="subdomain">
          <el-input v-model.trim="form.subdomain" :disabled="able" clearable placeholder="只需二级域名前缀" style="width:250px" />
        </el-form-item>
        <el-form-item v-show="form.app_key" label="app_key">
          <el-input v-model.trim="form.app_key" disabled placeholder="app_key  " style="width:250px" />
        </el-form-item>
        <el-form-item v-show="form.app_secret" label="app_secret ">
          <el-input v-model.trim="form.app_secret" disabled placeholder="app_secret" style="width:250px" />
        </el-form-item>
        <el-form-item label="邮箱账号前缀" prop="group_email">
          <el-input v-model.trim="form.group_email" clearable placeholder="请输入邮箱账号前缀" style="width:250px" />
        </el-form-item>
        <el-form-item v-show="source=='backstage'||source=='show'||!source" label="邮箱密码" prop="passowrd">
          <el-input v-model.trim="form.email_pwd" clearable placeholder="请输入邮箱密码" style="width:250px" />
          <el-button v-permission="['group:list:extend:update','group:step']" size="small" type="primary" style="margin-left:10px;vertical-align: baseline;" class="filter-item " @click="order">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getExtend, createExtend, updateExtend } from '@/api/extend'
import Cookies from 'js-cookie'

export default {
  props: {
    source: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      required: true
    },
    status: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (!/^[a-z0-9]+$/i.test(value)) {
        callback(new Error('请输入正确的二级域名前缀'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!/^[a-z0-9]+$/i.test(value)) {
        callback(new Error('请输入正确邮箱账号前缀'))
      } else {
        callback()
      }
    }
    const validateFile = (rule, value, callback) => {
      if (!value && !this.form.supplier_introduction_file) {
        callback(new Error('请上传供应商激活介绍信'))
      } else {
        callback()
      }
    }

    return {
      code: '',
      able: false,
      frontFileList: [],
      fileList: [],
      logo_status: 'false',
      uploadUrl: process.env.VUE_APP_BASE_API + '/extend/upload',
      uploadPdfUrl: process.env.VUE_APP_BASE_API + '/rest/upload',
      headers: {
        'authKey': Cookies.get('authKey'),
        'sessionId': Cookies.get('sessionId')
      },
      form: {
        subdomain: '',
        group_code: '',
        extend_code: '',
        email_pwd: '',
        logo: '',
        group_email: '',
        app_key: '',
        app_secret: '',
        supplier_introduction_file: ''
      },
      moreData: {
        f_code: ''
      },
      temp: {

      },
      rules: {
        subdomain: [
          {
            required: true,
            trigger: 'blur',
            validator: validateName
          }
        ],
        logo: [
          {
            required: true,
            message: '集团logo图不能为空',
            trigger: 'blur'
          }
        ],
        group_email: [
          {
            required: true,
            trigger: 'blur',
            validator: validateEmail
          }
        ],
        email_pwd: [
          {
            required: true,
            message: '邮箱密码不能为空',
            trigger: 'blur'
          }
        ],
        supplier_introduction_file: [
          {
            required: true,
            trigger: 'blur',
            validator: validateFile
          }
        ]
      }
    }
  },
  computed: {
    moreUploadData() {
      return {
        group_name: this.name,
        file_name: 'user_authorized_pdf',
        file_type: 3
      }
    }
  },
  watch: {
    code() {
      if (this.code) {
        this.fetchData()
      } else {
        this.form = {
          subdomain: '',
          group_code: '',
          extend_code: '',
          logo: '',
          password: '',
          email_pwd: '',
          app_key: '',
          app_secret: '',
          supplier_introduction_file: ''
        }
      }
    },
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'extend') {
          this.code = this.value.code
        }
      }
    }
  },
  created() {
    this.code = ''
    this.code = this.value.code || this.$route.query.group_code
  },
  methods: {
    handleError() {
      this.$notify({
        type: 'error',
        message: '请求失败！',
        duration: 2000
      })
    },
    handleUpload(res) {
      this.$notify({
        type: +res.code !== 200 ? 'error' : 'success',
        message: res.msg,
        duration: 2000
      })
      if (res.code !== 200) {
        return
      }
      this.form = Object.assign(this.form, { supplier_introduction_file: res.data })
      this.fileList = []
    },
    getLook(authorized_file_path) {
      window.open(`/#/pdf/index?src=/${authorized_file_path}`, '_blank')
    },
    beforeUpload(file) {
      var regex = /\.pdf|\.docx?$/i
      const canUpload = regex.test(file.name)
      if (!canUpload) {
        this.$message.error('上传的授权文件只能是 PDF，DOC，DOCX 格式!')
      }
      return canUpload
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpg'
      const isJPEG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isICO = file.type === 'image/ico'
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isJPG && !isPNG && !isJPEG && !isICO) {
        this.$message.error('上传图片只能是 JPG，PNG，JPEG，ICO 格式!')
      }
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB!')
      }
      return (isJPG && isLt3M) || (isLt3M && isPNG) || (isLt3M && isJPEG) || (isLt3M && isICO)
    },
    handleImgFront(res, file) {
      if (res.code !== 200) {
        this.frontFileList = []
      }
      this.form.logo = res.code === 200 ? res.data : ''
      this.logo_status = false
      this.logo_status = res.code === 200
    },
    fetchData() {
      const code = this.code
      getExtend(code, '.extend_container').then(res => {
        this.form = Object.assign({}, res.data)
        this.able = !!this.form.subdomain
        this.logo_status = !!this.form.logo
      })
    },
    changeData() {
      const tempObject = {}
      this.form.group_code = this.code
      Object.keys(this.form).forEach((key) => {
        if (this.form[key] || this.form[key] === 0) {
          tempObject['f_' + key] = this.form[key]
        }
      })
      if (tempObject.f_extend_code) {
        tempObject.f_code = tempObject.f_extend_code
        delete tempObject.f_extend_code
      }
      this.temp = Object.assign({}, tempObject)
    },
    order() {
      this.$refs['form'].validate(valid => {
        this.changeData()
        if (valid) {
          (this.temp.f_code ? updateExtend(this.temp, '.extend_container') : createExtend(this.temp, '.extend_container'))
            .then(() => {
              this.fetchData()
            }).catch(() => {})
        }
      })
    }
  }
}
</script>
<style scoped>
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.active.extend_container{
  height: calc(100vh - 356px);
  overflow:auto;
  padding-bottom:0!important;
}
.extend_container{
  height: calc(100vh - 235px);
  overflow:auto;
}
</style>


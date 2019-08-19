<template>
  <el-form :rules="rules" :inline="true" :model="temp" label-position="right" class="dialog" label-width="11rem">
    <el-form-item label="联系人姓氏" prop="f_last_name">
      <el-input v-model.trim="temp.f_last_name" clearable placeholder="请填写联系人姓氏" style="width:250px" />
    </el-form-item>
    <el-form-item label="联系人名字" prop="f_first_name">
      <el-input v-model.trim="temp.f_first_name" clearable placeholder="请填写联系人名字" style="width:250px" />
    </el-form-item>
    <el-form-item label="联系人职位" prop="f_user_position">
      <el-input v-model.trim="temp.f_user_position" clearable placeholder="请填写联系人职位" style="width:250px" />
    </el-form-item>
    <el-form-item label="联系人电话" prop="f_user_phone">
      <el-input v-model.trim="temp.f_user_phone" clearable placeholder="请填写联系人电话" style="width:250px" />
    </el-form-item>
    <el-form-item label="联系人邮箱" prop="f_user_email">
      <el-input v-model.trim="temp.f_user_email" :disabled="isActivated==2" placeholder="请填写联系人邮箱" clearable style="width:250px" />
    </el-form-item>
    <el-form-item label="企业负责人">
      <el-radio v-model="temp.f_is_enterprise" :label="1" style="margin-left:10px;width:96px">是</el-radio>
      <el-radio v-model="temp.f_is_enterprise" :label="0" style="margin-left:10px;width:96px">否</el-radio>
    </el-form-item>
    <el-form-item label="财务负责人">
      <el-radio v-model="temp.f_is_financial" :label="1" style="margin-left:10px;width:96px">是</el-radio>
      <el-radio v-model="temp.f_is_financial" :label="0" style="margin-left:10px;width:96px">否</el-radio>
    </el-form-item>
    <el-form-item label="平台授权登录">
      <el-radio v-model="temp.f_is_login_permission" :disabled="isActivated==2" :label="1" style="margin-left:10px;width:96px">是</el-radio>
      <el-radio v-model="temp.f_is_login_permission" :disabled="isActivated==2" :label="0" style="margin-left:10px;width:96px">否</el-radio>
    </el-form-item>
    <!-- <el-form-item label="联系人状态">
      <el-radio v-model="temp.f_status" :label="1" style="margin-left:10px;width:96px">激活</el-radio>
      <el-radio v-model="temp.f_status" :label="0" style="margin-left:10px;width:96px">禁用</el-radio>
    </el-form-item> -->
  </el-form>
</template>

<script>
import { isPhone, isEmail, isTransferred } from '@/utils/validate'
export default {
  props: {
    temp: {
      type: Object,
      default: () => {
        return {
          f_last_name: '',
          f_first_name: '',
          f_user_position: '',
          f_user_phone: '',
          f_group_code: '',
          f_user_email: '',
          f_user_role: []
        }
      }
    },
    isActivated: {
      type: String,
      default: ''
    }
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入联系人电话'))
      } else if (value.length < 9) {
        callback(new Error('请输入联系人电话的区号'))
      } else if (!isPhone(value)) {
        callback(new Error('请输入正确的号码格式'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮箱'))
      } else if (!isEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    var validateData = (rule, value, callback) => {
      if (!value) {
        callback(new Error('该内容数据不能为空'))
      } else if (isTransferred(value)) {
        callback(new Error('该内容数据不能存在转义字符！'))
      } else {
        callback()
      }
    }

    return {
      rules: {
        f_last_name: [
          {
            required: true,
            trigger: 'blur',
            validator: validateData
          }
        ],
        f_first_name: [
          {
            required: true,
            trigger: 'blur',
            validator: validateData
          }
        ],
        f_user_position: [
          {
            required: true,
            trigger: 'blur',
            validator: validateData
          }
        ],
        f_user_phone: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePhone
          }
        ],
        f_user_email: [
          {
            required: true,
            trigger: 'blur',
            validator: validateEmail
          }
        ]
      }
    }
  }
}
</script>


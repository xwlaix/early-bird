<template>
  <el-form :rules="rules" :inline="true" :model="temp" label-position="right" class="dialog" label-width="11rem">
    <el-form-item label="公司中文名称" prop="f_name">
      <el-input v-model.trim="temp.f_name" clearable placeholder="请填写公司中文名称" style="width:250px" />
    </el-form-item>
    <el-form-item label="公司英文名称" prop="f_en_name">
      <el-input v-model.trim="temp.f_en_name" placeholder="请填写公司英文名称" clearable style="width:250px" />
    </el-form-item>
    <el-form-item label="数据同步方式" prop="f_sync_type">
      <el-radio v-model="temp.f_sync_type" :label="1" style="margin-left:10px;width:96px">自动</el-radio>
      <el-radio v-model="temp.f_sync_type" :label="0" style="margin-left:10px;width:96px">手动</el-radio>
    </el-form-item>
    <el-form-item label="商洽片区" prop="f_area">
      <el-select v-model="temp.f_area" class="filter-item" filterable clearable placeholder="请选择商洽片区" style="width:250px">
        <el-option v-for="item in areaList" :key="item.name" :label="item.name" :value="item.name" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { isTransferred } from '@/utils/validate'
export default {
  props: {
    temp: {
      type: Object,
      default: () => {
        return {
          f_code: '',
          f_name: '',
          f_en_name: '',
          f_group_code: '',
          f_sync_type: '',
          f_area: ''
        }
      }
    }
  },
  data() {
    var validate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('公司中文名称不能为空'))
      } else if (isTransferred(value)) {
        callback(new Error('公司中文名称不能存在转义字符！'))
      } else {
        callback()
      }
    }
    var validateEn = (rule, value, callback) => {
      if (!value) {
        callback(new Error('公司英文名称不能为空'))
      } else if (isTransferred(value)) {
        callback(new Error('公司英文名称不能存在转义字符！'))
      } else if (/[\u4e00-\u9fa5]+/.test(value)) {
        callback(new Error('公司英文名称不能含有汉字！'))
      } else {
        callback()
      }
    }
    return {
      areaList: [{
        name: '大陆'
      }, {
        name: '香港'
      }],
      rules: {
        f_name: [
          {
            required: true,
            trigger: 'blur',
            validator: validate
          }
        ],
        f_en_name: [
          {
            required: true,
            trigger: 'blur',
            validator: validateEn
          }
        ],
        f_sync_type: [
          {
            required: true,
            message: '请选择数据同步方式',
            trigger: 'change'
          }
        ],
        f_area: [
          {
            required: true,
            message: '请选择商洽片区',
            trigger: 'change'
          }
        ]
      }
    }
  }
}
</script>


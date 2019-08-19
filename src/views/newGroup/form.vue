<template>
  <el-form :rules="rules" :inline="true" :model="temp" label-position="right" class="dialog" label-width="9rem">
    <el-form-item label="集团名称" prop="f_name">
      <el-input v-model.trim="temp.f_name" clearable />
    </el-form-item>
    <el-form-item label="集团网站" prop="f_web_site">
      <el-input v-model.trim="temp.f_web_site" clearable />
    </el-form-item>
    <el-form-item label="集团编号" prop="f_group_number">
      <el-input v-model.trim="temp.f_group_number" clearable />
    </el-form-item>
    <el-form-item label="集团类型" prop="f_type_id">
      <el-select v-model="temp.f_type_id" class="filter-item" filterable clearable placeholder="请选择所属集团类型">
        <el-option v-for="item in selectTemp.types" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="集团总机" prop="f_contact_phone">
      <el-input v-model.trim="temp.f_contact_phone" clearable />
    </el-form-item>
    <el-form-item label="所属行业" prop="f_industry_id">
      <el-select v-model="temp.f_industry_id" class="filter-item" filterable clearable placeholder="请选择所属行业">
        <el-option v-for="item in selectTemp.industrys" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="所属销售" prop="f_seller_id">
      <el-select v-model="temp.f_seller_id" class="filter-item" filterable clearable placeholder="请选择所属销售">
        <el-option v-for="item in seller" :key="item.id" :value="item.id" :label="item.username" />
      </el-select>
    </el-form-item>
    <el-form-item label="财年截止时间" prop="f_fiscal_month">
      <el-select v-model="temp.f_fiscal_month" class="filter-item" filterable clearable placeholder="请选择财年截至时间">
        <el-option v-for="item in selectTime" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="所属国家地区" prop="f_country">
      <el-select v-model="temp.f_country" filterable clearable placeholder="请选择" @change="getProvince">
        <el-option
          v-for="item in options"
          :key="item.code"
          :value="item.name"
        />
      </el-select>
    </el-form-item>

    <el-form-item v-show="temp.f_country==='中国'" label="集团省份" prop="province">
      <el-select v-model="province" class="filter-item" filterable clearable placeholder="请选择所属省份" @change="getCity">
        <el-option v-for="item in provinces" :key="item.id" :value="item.name" />
      </el-select>
    </el-form-item>
    <el-form-item label="集团城市" prop="city">
      <el-select v-model="city" class="filter-item" filterable clearable placeholder="请选择城市" @change="getAddress">
        <el-option v-for="item in citys" :key="item.id" :value="item.name" />
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="" prop="f_currency_sign">
      <el-select v-model="temp.f_currency_sign" class="filter-item" filterable clearable placeholder="请选择集团财报币别">
        <el-option v-for="item in currency_sign" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item> -->

  </el-form>
</template>

<script>
import { seller_list } from '@/api/group'
import { isPhone, isUrl, isTransferred } from '@/utils/validate'
import location from '@/assets/location.json'
export default {
  props: {
    temp: {
      type: Object,
      default: () => {
        return {
          f_code: '',
          f_name: '',
          f_web_site: '',
          f_group_number: '',
          f_industry_id: '',
          f_country: '',
          f_type_id: '',
          f_contact_phone: '',
          f_province: '',
          f_city: '',
          f_fiscal_month: '',
          f_seller_id: '',
          f_currency_sign: ''
        }
      }
    },
    selectTemp: {
      type: Object,
      default: () => {
        return {
          industrys: [],
          countrys: [],
          types: []
        }
      }
    }
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入集团总机'))
      } else if (value.length < 9) {
        callback(new Error('请输入集团总机的区号'))
      } else if (!isPhone(value)) {
        callback(new Error('请输入正确的集团总机'))
      } else {
        callback()
      }
    }
    var validateCity = (rule, value, callback) => {
      if (!this.temp.f_city || !this.city) {
        callback(new Error('请输入集团城市'))
      } else {
        callback()
      }
    }
    var validateProvince = (rule, value, callback) => {
      if (this.temp.f_country !== '中国') {
        callback()
      } else {
        if (!this.temp.f_province || !this.province) {
          callback(new Error('请输入集团省份'))
        } else {
          callback()
        }
      }
    }
    var validateUrl = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入集团网址'))
      } else if (!isUrl(value)) {
        callback(new Error('请输入正确的集团网址'))
      } else {
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入集团名称'))
      } else if (/^[_]{1}/.test(value)) {
        callback(new Error('集团名称不能一下划线开头'))
      } else if (isTransferred(value)) {
        callback(new Error(`不能使用转义字符，请使用合法字符`))
      } else {
        callback()
      }
    }
    var validate_group_number = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入集团编号'))
      } else if (!/^\w+$/.test(value)) {
        callback(new Error('集团编号只能为数字、大小写字母、下划线_等组成'))
      } else if (isTransferred(value)) {
        callback(new Error(`不能使用转义字符，请使用合法字符`))
      } else {
        callback()
      }
    }

    return {
      seller: [],
      options: location,
      selectTime: [],
      citys: [],
      provinces: [],
      city: '',
      province: '',
      // currency_sign: [{
      //   id: '￥',
      //   name: '人民币'
      // }, {
      //   id: '$',
      //   name: '美元'
      // }, {
      //   id: 'HK$',
      //   name: '港币'
      // }, {
      //   id: 'NT$',
      //   name: '台币'
      // }, {
      //   id: '€',
      //   name: '欧元'
      // }, {
      //   id: 'JPY￥',
      //   name: '日元'
      // }],
      rules: {
        f_name: [
          {
            required: true,
            trigger: 'blur',
            validator: validateName
          }
        ],
        f_web_site: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUrl
          }
        ],
        f_group_number: [
          {
            required: true,
            trigger: 'blur',
            validator: validate_group_number
          }
        ],
        f_industry_id: [
          {
            required: true,
            message: '请选择所属行业',
            trigger: 'change'
          }
        ],
        f_type_id: [
          {
            required: true,
            message: '请选择集团类型',
            trigger: 'change'
          }
        ],
        f_contact_phone: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePhone
          }
        ],
        f_country: [
          {
            required: true,
            trigger: 'change',
            message: '请选择所属国家地区'
          }
        ],
        city: [
          {
            required: true,
            trigger: 'change',
            validator: validateCity
          }
        ],
        province: [
          {
            required: true,
            trigger: 'change',
            validator: validateProvince
          }
        ]
      }
    }
  },
  created() {
    this.getSelect()
  },
  methods: {
    getSelect() {
      for (let i = 1; i < 13; i++) {
        this.selectTime.push({
          value: i,
          label: `${i}月最后一日`
        })
      }
      seller_list().then(res => {
        this.seller = res.data
      })
    },
    setAddress() {
      const country = this.temp.f_country
      this.getProvince(country)
      if (country === '中国' && this.temp.f_province) {
        this.province = this.temp.f_province
        this.getCity(this.temp.f_province)
      }
      this.city = this.temp.f_city
    },
    getCity(val) {
      if (val) {
        const f_city = this.provinces.find((v) => {
          return v.name === val
        })
        this.citys = f_city.children
        this.temp.f_province = val
      } else {
        this.citys = []
        this.temp.f_province = ''
        this.temp.f_city = ''
      }
      this.city = ''
    },
    getProvince(val) {
      this.temp.f_country = val
      const f_country = this.options.find((v) => {
        return v.name === val
      })
      if (val === '中国') {
        this.citys = []
        this.city = ''
        this.province = ''
        this.provinces = []
        this.provinces = f_country.children
      } else if (val) {
        this.city = ''
        this.citys = f_country.children.children
      }
    },
    getAddress(val) {
      this.temp.f_city = val
    }
  }
}
</script>


<template>
  <el-form
    :rules="rules"
    :inline="true"
    :model="temp"
    label-position="right"
    class="dialog"
    label-width="11rem"
  >
    <el-form-item label="公司" prop="f_company_code">
      <el-select v-model="temp.f_company_code" :disabled="disable" style="width:250px;" class="filter-item" filterable clearable placeholder="请选择公司" @change="setMarket">
        <el-option v-for="item in companyList" :key="item.company_code" :label="item.name" :value="item.company_code" />
      </el-select>
    </el-form-item>
    <el-form-item label="币种名称" prop="f_currency_sign">
      <el-select v-model="temp.f_currency_sign" class="filter-item currency" style="width:250px;" filterable clearable placeholder="请选择币种符号" @change="setMarket">
        <el-option v-for="item in currency_list" :key="item.sign" :label="item.name" :value="item.sign" />
      </el-select>
    </el-form-item>
    <el-form-item label="市场名称" prop="f_market_name">
      <el-input v-model.trim="temp.f_market_name" clearable disabled placeholder="根据公司和币种名称生成" style="width:250px;" />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model.trim="temp.f_memo" clearable placeholder="请填写备注" style="width:250px;" />
    </el-form-item>
    <el-form-item label="市场负责人" prop="f_market_user">
      <el-select v-model="temp.f_market_user" multiple collapse-tags disabled class="filter-item" style="width:250px;" filterable clearable placeholder="请从下方表格添加市场负责人">
        <el-option v-for="item in temp.f_market_authorized_user" :key="item.user_code" :label="item.user_name" :value="item.user_code" />
      </el-select>
    </el-form-item>
    <el-form-item label="应付清算部门邮箱" prop="f_charge_user_name">
      <el-input v-model.trim="temp.f_charge_user_name" clearable placeholder="请填写应付清算部门邮箱" style="width:250px;" />
      <!-- <el-select v-model="temp.f_charge_user_code" class="filter-item" style="width:250px;" filterable clearable placeholder="请选择应收账款负责人">
        <el-option v-for="item in chargeList" :key="item.contact_code" :label="item.user_name" :value="item.contact_code" />
      </el-select> -->
    </el-form-item>
    <el-form-item label="付款周期" prop="f_cycle_type">
      <el-radio v-model="temp.f_cycle_type" label="day" style="margin-left:10px;width:98px">日付</el-radio>
      <el-radio v-model="temp.f_cycle_type" label="week" style="margin-left:10px;width:98px">周付</el-radio>
    </el-form-item>
    <el-form-item :label="f_cycle_days" prop="f_cycle_days">
      <el-select v-model="temp.f_cycle_days" class="filter-item currency" style="width:250px;" filterable clearable placeholder="请选择付款周期天数">
        <el-option v-for="(item,index) in f_cycle_days_arr" :key="index" :value="index+1" />
      </el-select>
      <span style="margin-left:5px;">天付款</span>
    </el-form-item>
  </el-form>
</template>

<script>
import { isEmail } from '@/utils/validate'
import { currencyList } from '@/api/market'
export default {
  props: {
    dialogStatus: {
      type: String,
      default: ''
    },
    temp: {
      type: Object,
      default: () => {
        return {
          f_group_code: '',
          f_company_code: '',
          f_market_name: '',
          f_currency_sign: '',
          f_currency_name: '',
          f_memo: '',
          f_cycle_days: '',
          f_cycle_type: 'day',
          f_charge_user_code: '',
          f_charge_user_name: '',
          f_market_authorized_user: [],
          f_market_user: []
        }
      }
    },
    chargeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    contactList: {
      type: Array,
      default: () => {
        return []
      }
    },
    companyList: {
      type: Array,
      required: true
    }
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value) {
        if (!isEmail(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          let flag = true
          for (const v of this.chargeList) {
            if (v.user_email === this.temp.f_charge_user_name) {
              this.temp.f_charge_user_code = v.contact_code
              flag = false
              break
            }
          }
          if (flag) {
            callback()
          } else {
            callback(new Error('该邮箱已经选为市场负责人了，请重新输入！'))
          }
        }
      } else {
        callback()
      }
    }
    const validateDay = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写付款周期天数'))
      } else if (!/^[0-9]*$/.test(value)) {
        callback(new Error('付款周期天数必须为数字'))
      } else if (value < 1 || value > 7) {
        callback(new Error('付款周期天数必须在1至7之间'))
      } else if (this.temp.f_cycle_type === 'week' && this.temp.f_cycle_days > 5) {
        this.temp.f_cycle_days = ''
        callback(new Error('付款周期为周付时，天数不能大于7'))
      } else {
        callback()
      }
    }
    return {
      disable: false,
      companyName: '',
      currencyName: '',
      currency_list: [],
      f_cycle_type_list: [
        {
          label: '周付',
          value: 'week'
        }, {
          label: '日付',
          value: 'day'
        }
      ],
      f_cycle_type: [],
      rules: {
        f_company_code: [
          {
            required: true,
            message: '请选择公司',
            trigger: 'change'
          }
        ],
        f_market_name: [
          {
            required: true,
            message: '市场名称不能为空',
            trigger: 'blur'
          }
        ],
        f_currency_sign: [
          {
            required: true,
            message: '币种符号不能为空',
            trigger: 'blur'
          }
        ],
        f_currency_name: [
          {
            required: true,
            message: '币种名称不能为空',
            trigger: 'blur'
          }
        ],
        f_market_user: [
          {
            required: true,
            message: '请在下方添加市场负责人',
            trigger: 'change'
          }
        ],
        f_cycle_type: [
          {
            required: true,
            message: '请选择早付方式',
            trigger: 'change'
          }
        ],
        f_cycle_days: [
          {
            required: true,
            validator: validateDay,
            trigger: 'blur'
          }
        ],
        f_charge_user_name: [
          {
            validator: validateEmail,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    f_cycle_days() {
      return this.temp.f_cycle_type === 'day' ? '清算后第' : '清算后每周第'
    },
    f_cycle_days_arr() {
      return this.temp.f_cycle_type === 'day' ? Array(7) : Array(5)
    },
    email() {
      return this.temp.f_charge_user_name
    }

  },
  watch: {
    dialogStatus() {
      if (this.dialogStatus === 'update') {
        this.disable = true
      } else {
        this.disable = false
      }
    },
    email() {
      for (const v of this.contactList) {
        if (v.user_email === this.temp.f_charge_user_name) {
          this.temp.f_charge_user_code = v.contact_code
          break
        }
      }
    }
  },
  created() {
    currencyList('.currency').then(res => {
      this.currency_list = res.data
    })
  },
  methods: {
    getCompanyName() {
      for (const v of this.companyList) {
        if (v.company_code === this.temp.f_company_code) {
          this.companyName = v.name
          break
        }
      }
    },
    getCurrencyName() {
      for (const v of this.currency_list) {
        if (v.sign === this.temp.f_currency_sign) {
          this.currencyName = v.name
          this.temp.f_currency_name = this.currencyName
          break
        }
      }
    },
    setMarket(value) {
      if (this.temp.f_company_code) {
        this.getCompanyName()
      }
      if (this.temp.f_currency_sign) {
        this.getCurrencyName()
      }
      if (this.companyName && this.currencyName) {
        this.temp.f_market_name = `${this.companyName}_${this.currencyName}`
      }
    }
  }
}
</script>


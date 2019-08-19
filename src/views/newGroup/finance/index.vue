<template>
  <div>
    <div :class="{ active: status }" class="filter-container finance_container">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" class="form" label-width="220px">
        <el-form-item label="集团财报币别" prop="currency_sign">
          <el-select v-model="form.currency_sign" class="filter-item currency" style="width:250px;" filterable clearable placeholder="请选择集团财报币别">
            <el-option v-for="item in currency_list" :key="item.name" :label="item.name" :value="item.sign" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-show="form.finance_code" label="集团财务编码:">
          <el-input v-model.trim="form.finance_code" readonly placeholder="集团财务编码" style="width:250px" />
        </el-form-item> -->
        <el-form-item label="年销售额" prop="sale_volume_id">
          <el-select v-model="form.sale_volume_id" class="filter-item" style="width:250px;" filterable clearable placeholder="请选择年销售额">
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="年采购额" prop="purhchase_volume_id">
          <el-select v-model="form.purhchase_volume_id" class="filter-item" style="width:250px;" filterable clearable placeholder="请选择年采购额">
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="现金流状况" prop="cashflow_volume_id">
          <el-select v-model="form.cashflow_volume_id" class="filter-item" style="width:250px;" filterable clearable placeholder="请选择资金流状况">
            <el-option v-for="item in cashflow" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <!-- <el-button v-permission="['group:list:finance:add','group:step']" v-show="!form.finance_code&&source!=='step'"  type="primary" style="margin-left:10px;vertical-align: baseline;" class="filter-item " @click="order">添加</el-button> -->
        </el-form-item>
        <el-form-item label="供应商数量" prop="vendor_num">
          <el-input v-model.number="form.vendor_num" style="width:250px;" class="filter-item" clearable placeholder="请填写供应商数量" />
        </el-form-item>
        <el-form-item label="常用账期(天)" prop="finance_max_day">
          <el-input v-model.number="form.finance_min_day" clearable placeholder="开始时间" style="width:105px;margin-right:12px" />至
          <el-input v-model.number="form.finance_max_day" clearable placeholder="结束时间" style="width:105px;;margin-left:10px" />
          <el-button v-show="source=='backstage'||source=='show'||!source" v-permission="['group:list:finance:update','group:step']" size="small" type="primary" style="margin-left:10px;vertical-align: baseline;" class="filter-item " @click="order">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getFinance, createFinance, updateFinance } from '@/api/finance'
import { currencyList } from '@/api/market'

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
    }
  },
  data() {
    var validateSupplier = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('供应商数量必填'))
      } else if (!/^[0-9]*$/.test(value)) {
        callback(new Error('供应商数量必须为数字'))
      } else {
        callback()
      }
    }
    var validateDay = (rule, value, callback) => {
      if (this.form.finance_max_day === '' || this.form.finance_min_day === '') {
        callback(new Error('常用账期必填'))
      } else if (!/^[0-9]*$/.test(this.form.finance_max_day) || !/^[0-9]*$/.test(this.form.finance_min_day)) {
        callback(new Error('常用账期必须为数字'))
      } else if (this.form.finance_max_day <= this.form.finance_min_day) {
        callback(new Error('常用账期结束时间要大于开始时间'))
      } else {
        callback()
      }
    }
    return {
      currencyName: '',
      currency_list: [],
      code: this.$route.query.group_code,
      list: [{
        id: 1,
        name: '1亿以内'
      }, {
        id: 2,
        name: '1亿-5亿'
      }, {
        id: 3,
        name: '5亿-20亿'
      }, {
        id: 4,
        name: '20亿—100亿'
      }, {
        id: 5,
        name: '100亿以上'
      }],
      cashflow: [{
        id: 1,
        name: '每月多次充裕现金'
      }, {
        id: 2,
        name: '每月特定一次时间'
      }, {
        id: 3,
        name: '多月一次'
      }],
      form: {
        currency_sign: '',
        currency_name: '',
        finance_code: '',
        group_code: '',
        sale_volume_id: '',
        sale_volume: '',
        purhchase_volume_id: '',
        purhchase_volume: '',
        cashflow_volume_id: '',
        cashflow_volume: '',
        vendor_num: '',
        finance_min_day: '',
        finance_max_day: '',
        status: ''
      },
      temp: {

      },
      rules: {
        sale_volume_id: [
          {
            required: true,
            message: '年销售额不能为空，请选择年销售额',
            trigger: 'change'
          }
        ],
        purhchase_volume_id: [
          {
            required: true,
            message: '年采购额不能为空，请选择年采购额',
            trigger: 'change'
          }
        ],
        cashflow_volume_id: [
          {
            required: true,
            message: '资金流状况不能为空，请选择资金流状况',
            trigger: 'change'
          }
        ],
        vendor_num: [
          {
            required: true,
            validator: validateSupplier,
            trigger: 'blur'
          }
        ],
        currency_sign: [
          {
            required: true,
            message: '集团财报币别不能为空',
            trigger: 'change'
          }
        ],
        finance_max_day: [
          {
            required: true,
            validator: validateDay,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    code(val) {
      if (val) {
        this.fetchData()
      } else {
        this.form = {
          currency_sign: '',
          currency_name: '',
          finance_code: '',
          group_code: '',
          sale_volume_id: '',
          sale_volume: '',
          purhchase_volume_id: '',
          purhchase_volume: '',
          cashflow_volume_id: '',
          cashflow_volume: '',
          status: '',
          vendor_num: '',
          finance_min_day: '',
          finance_max_day: ''
        }
      }
    },
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'finance' || val.active === 2) {
          this.code = this.value.code
        }
      }
    }
  },
  created() {
    this.code = ''
    this.code = this.value.code || this.$route.query.group_code
    this.getCurrency()
  },
  methods: {
    getCurrency() {
      currencyList('.currency').then(res => {
        this.currency_list = res.data
      })
    },
    fetchData() {
      const code = this.code
      getFinance(code, '.finance_container').then(res => {
        if (res.data.length === 0) {
          try {
            this.$refs['form'].clearValidate()
          } catch (error) {
            console.log(error)
          }
        } else {
          this.form = Object.assign({}, res.data)
        }
      }).catch(() => {
        try {
          this.$refs['form'].clearValidate()
        } catch (error) {
          console.log(error)
        }
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
      for (const v of this.list) {
        if (v.id === tempObject.f_sale_volume_id) {
          tempObject.f_sale_volume = v.name
          break
        }
        if (v.id === tempObject.f_purhchase_volume_id) {
          tempObject.f_purhchase_volume = v.name
          break
        }
      }
      for (const v of this.cashflow) {
        if (v.id === tempObject.f_cashflow_volume_id) {
          tempObject.f_cashflow_volume = v.name
          break
        }
      }
      for (const v of this.currency_list) {
        console.log(v)
        console.log(tempObject.f_currency_sign)
        if (v.sign === tempObject.f_currency_sign) {
          tempObject.f_currency_name = v.name
          break
        }
      }

      if (tempObject.f_finance_code) {
        tempObject.f_code = tempObject.f_finance_code
        delete tempObject.f_finance_code
      }
      this.temp = Object.assign({}, tempObject)
    },
    order() {
      this.$refs['form'].validate(valid => {
        this.changeData()
        if (valid) {
          if (!this.form.group_code) {
            this.$notify({
              type: 'error',
              message: '获取集团信息失败！',
              duration: 2000
            })
          } else {
            (this.temp.f_code ? updateFinance : createFinance)(this.temp, '.finance_container')
              .then(() => {
                try {
                  this.$parent.jump(1)
                } catch (error) {
                  console.log(error)
                }
                this.fetchData()
              }).catch(() => {})
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.active.finance_container{
  height: calc(100vh - 356px);
  overflow:auto;
}
.finance_container{
  height: calc(100vh - 235px);
  overflow:auto;
}
</style>


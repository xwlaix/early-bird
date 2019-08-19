<template>
  <div>
    <div :class="{ active: status }" class="filter-container finance_container">
      <el-form ref="form" :model="form" label-position="right" class="form" label-width="220px">
        <el-form-item label="币种" prop="currency_sign">
          <el-select v-model="form.currency_sign" class="filter-item currency" disabled style="width:250px;" filterable clearable placeholder="请选择币种">
            <el-option v-for="item in currency_list" :key="item.name" :label="item.name" :value="item.sign" />
          </el-select>
        </el-form-item>
        <el-form-item label="1亿以下" prop="vendor_num">
          <el-input v-model.number="form.vendor_num" style="width:250px;" disabled class="filter-item" clearable placeholder="请填写佣金比例" />
        </el-form-item>
        <el-form-item label="1亿-5亿" prop="vendor_num">
          <el-input v-model.number="form.vendor_num" style="width:250px;" disabled class="filter-item" clearable placeholder="请填写佣金比例" />
        </el-form-item>
        <el-form-item label="5亿以上" prop="vendor_num">
          <el-input v-model.number="form.vendor_num" style="width:250px;" disabled class="filter-item" clearable placeholder="请填写佣金比例" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getFinance } from '@/api/finance'
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
    return {
      currencyName: '',
      currency_list: [],
      code: this.$route.query.group_code,
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
        if (val.active === 'commission') {
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


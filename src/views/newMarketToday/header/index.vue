<template>
  <el-card class="box-card header">
    <div slot="header" class="clearfix header">
      <center :header-title="headerTitle" />
      <el-row :gutter="10" style="margin-left:0!important; margin-right: 0!important;">
        <el-col :xs="12" :sm="12" :md="10" :lg="6" :xl="6">
          <div class="lineOne supermarket">{{ marketValue.name }}</div>
          <div class="lineTwoWrap">
            <div v-for="(item,index) in marketValue.value" :key="index" class="lineTwo supermarket">{{ item }}</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="4" :xl="4">
          <div class="lineOne  retail">{{ rate.name }}</div>
          <div class="lineTwoWrap">
            <div v-for="(item,index) in (rate.value)" :key="index" class="lineTwo  retail">{{ item }}</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="4" :md="6" :lg="4" :xl="4">
          <el-tooltip class="item" effect="dark" content="清算占比" placement="right">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" class="progress" />
          </el-tooltip>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="5" :xl="5">
          <div class="lineOne manufacturing">{{ clearing.name }}</div>
          <div class="lineTwoWrap">
            <div v-for="(item,index) in clearing.value" :key="index" class="lineTwo manufacturing">{{ item }}</div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="5" :xl="5">
          <div class="lineOne other">{{ discount.name }}</div>
          <div class="lineTwoWrap">
            <div v-for="(item,index) in discount.value" :key="index" class="lineTwo other">{{ item }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import center from './center'
import { current_stat_list } from '@/api/marketDetail'
import { numFormat } from '@/utils'

export default {
  components: { center },
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headerTitle: {
        expect_apr: '',
        market_name: '',
        reserve_percent: '',
        reserve_amount: '',
        valid_amount: '',
        clear_amount: ''
      },
      marketValue: {
        name: '市场价值',
        value: ''
      },
      clearing: {
        name: '现金使用',
        value: ''
      },
      rate: {
        name: '年化率',
        value: ''
      },
      discount: {
        name: '折扣收入',
        value: ''
      }
    }
  },
  computed: {
    percentage() {
      if (this.headerTitle.clear_amount && +this.headerTitle.clear_amount !== 0) {
        const percentage = +((this.headerTitle.valid_amount / this.headerTitle.clear_amount) * 100).toFixed(2)
        return percentage > 100 ? 100.00 : percentage
      } else {
        return 0.00
      }
    }
  },
  watch: {
    code() {
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    numFormat,
    fetchData() {
      if (!this.code) {
        this.headerTitle = {}
        return
      }
      current_stat_list({ market_code: this.code }).then(res => {
        if (res.data.length <= 0) {
          return false
        }
        this.headerTitle = Object.assign({}, res.data[0])
        this.marketValue.value = `${res.data[0].currency_sign}${this.numFormat(res.data[0].valid_amount)}`
        this.clearing.value = `${res.data[0].currency_sign}${this.numFormat(res.data[0].allocated_funds)}`
        this.rate.value = `${res.data[0].expect_apr}`
        this.discount.value = `${res.data[0].currency_sign}${this.numFormat(res.data[0].clear_discount)}`
      })
    }
  }
}
</script>
<style scoped>
.header >>> .el-card__body {
  padding-bottom: 0 !important ;
  padding-top: 0 !important ;
}
.header >>> .el-card__header{
  padding-bottom: 10px !important ;
  padding-top: 0 !important ;
}
.lineOne {
  margin-top: 6px;
  text-align: center;
}
.lineTwoWrap {
  text-align: center;
  display: flex;
  margin-top: 5px;
  align-content: center;
  align-items: center;
  justify-content: center;
}
.lineTwo {
  flex: 1;
  flex-grow: 0;
  margin-top: 4px;
  margin-right: 2px;
  display: inline-block;
  padding: 2px;
  font-size: 16px;
  background: rgb(250, 236, 216);
  color: #fff;
  text-align: center;
  font-weight: bold;
}

.progress{
 width: 90%;
 margin: 35px auto 0;
}
.progress>>>.el-progress-bar__inner{
  text-align: center;
}
.progress>>>.el-progress-bar__innerText{
  text-align: center;
  color: #F56C6C !important;
}
</style>


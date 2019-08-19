
<template>
  <div class="baseInfo group_container">
    <span class="handle">
      <el-button type="text" @click="changeStatus">
        <i v-show="!status" class="el-icon-back" />
        <i v-show="status" class="el-icon-right" />
      </el-button>
    </span>
    <el-card :class="{ active: status }" class="second-card">
      <div slot="header" class="clearfix header">
        <!-- <span class="title">{{ data.name }} 基础信息</span>
        <span class="handle">
          <el-button type="text" @click="changeStatus">{{ status?'折叠':'展开' }}</el-button>
        </span> -->
      </div>
      <div class="left">

        <div class="logo">
          <span v-show="status" class="title">{{ data.name }} 基础信息</span>
          <el-image v-show="status" :src="data.group_logo" class="image" />
        </div>
        <ul v-show="status" class="flow-ul l sms-ul">
          <li>
            <span class="one">市场状态：</span>
            <span :class="{ activeStatus: data.market_status==1 }">
              {{ market_status[+data.market_status] }}</span>
          </li>
          <li>
            <span class="two">期望年化率：</span>
            {{ data.expect_apr }}%
          </li>
          <li>
            <span class="three">计划资金：</span>
            {{ numFormat(data.cashpool_amount) }}
          </li>
          <li>
            <span class="one">所属公司：</span>
            {{ data.company_name }}
          </li>
          <li>
            <span class="three">成本年化率：</span>
            {{ data.mini_apr }}%
          </li>
          <li>
            <span class="three">预留比列：</span>
            {{ data.reserve_percent }}
          </li>
          <li>
            <span class="one">所属集团：</span>
            {{ data.group_name }}
          </li>
          <li>
            <span class="three">下个付款日：</span>
            {{ data.paydate }}
          </li>
          <li>
            <span class="three">有效发票：</span>
            {{ data.available_invoice }}
          </li>
          <li>
            <span class="one">集团地址：</span>
            {{ data.address }}
          </li>
          <li>
            <span class="three">下个资金计划启动日期：</span>
            <span :style="{color:getColor}">{{ data.cashpool_plandate }}</span>
          </li>
          <!-- <li>
            <span class="three">支付周期：</span>
            {{ data.cycle_type=='week'?`每周第 ${data.cycle_days||''} 天`:`每隔 ${data.cycle_days||''} 天` }}
          </li> -->
          <li>
            <span class="three">现金余额 ：</span>
            {{ numFormat(data.available_amount) }}
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import { numFormat } from '@/utils'
import { calenarHoliday } from '@/api/holiday'
import moment from 'moment'

export default {
  props: {
    data: {
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
      market_status: {
        '-5': '市场停用',
        '-4': '未初始化',
        '-3': '无可清算',
        '-2': '资金不足',
        '-1': '买家关闭',
        0: '次日开市',
        1: '活跃交易'
      },
      holiday: []
    }
  },
  computed: {
    getColor() {
      if (this.data.cashpool_plandate) {
        const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD')
        if (this.data.cashpool_plandate === tomorrow) {
          if (!this.holiday.includes(tomorrow)) {
            const day = moment(tomorrow).day()
            console.log(day)
            if (day !== 0 && day !== 6) {
              return '#F56C6C'
            }
          }
        }
      }
      return ''
    }
  },
  created() {
    this.getHoliday()
  },
  methods: {
    numFormat,
    getHoliday() {
      calenarHoliday().then(res => {
        this.holiday.push(...Object.keys(res.data))
      })
    },
    changeStatus() {
      this.$emit('changeStatus')
    }
  }
}
</script>
<style scoped>
.baseInfoControl{
  position: absolute;
  right: 20px;
  top:0;
}
.baseInfoControl>>>.el-button--text{
  color: #fff!important;
}
.second-card>>>.el-card__body{
  padding: 0!important;
  background: #fff!important;
}
.active.second-card>>>.el-card__body{
  padding: 5px!important;
}
.logo{
  width: 110px;
  float: left;
  text-align: center;
  color: #F56C6C!important;
}

.image {
  line-height: 84px;
  height: 84px;
  width: 84px;
  margin-top: 0px!important;
}

</style>


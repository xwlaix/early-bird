
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
        <!-- <span class="title">{{ data.name }} 基础资料</span>
        <span class="handle">
          <el-button type="text" @click="changeStatus">{{ status?'折叠':'展开' }}</el-button>
        </span> -->
      </div>
      <div v-show="status" class="left">
        <ul class="flow-ul l sms-ul">
          <li>
            <span class="one">状态：</span>
            <span
              :class="{ activeStatus: data.market_status==1 }"
            >{{ market_status[+data.market_status] }}</span>
          </li>
          <li>
            <span class="three">不参与市场个数：</span>
            {{ data.paydate }}
          </li>
          <li>
            <span class="two">已注册用户数：</span>
            {{ data.cycle_days }}
          </li>
          <li>
            <span class="two">累计早付天数：</span>
            {{ data.cashpool_plandate }}
          </li>
          <li>
            <span class="one">国家：</span>
            {{ data.mini_apr }}
          </li>
          <li>
            <span class="three">已激活市场个数：</span>
            {{ data.address }}
          </li>
          <li>
            <span class="two">待注册用户数：</span>
            {{ data.group_name }}
          </li>

          <li>
            <span class="two">累计平均年化率：</span>
            {{ data.cashpool_plandate }}
          </li>

          <li>
            <span class="three">参与开市市场个数：</span>
            {{ data.expect_apr }}
          </li>
          <li>
            <span class="three">未激活市场个数：</span>
            {{ data.address }}
          </li>

          <li>
            <span class="two">市场平均复参次数：</span>
            {{ data.reserve_percent }}
          </li>
          <!-- <li>
            <span class="two">累计清算金额：</span>
            {{ data.company_name }}
          </li>

          <li>
            <span class="two">累计付出金额：</span>
            {{ data.available_amount }}
          </li>
          <li>
            <span class="one">开价年化率：</span>
            {{ data.available_invoice }}
          </li>

          <li>
            <span class="one">最低收款线：</span>
            {{ data.available_invoice }}
          </li>-->

          <li>
            <span class="two">最后一次交易时间：</span>
            {{ data.reserve_percent }}
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import { numFormat } from '@/utils'

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
        '-3': '无可清算',
        '-2': '资金不足',
        '-1': '买家关闭',
        0: '次日开市',
        1: '活跃交易'
      }
    }
  },
  methods: {
    numFormat,
    changeStatus() {
      this.$emit('changeStatus')
    }
  }
}
</script>
<style scoped>
.baseInfoControl {
  position: absolute;
  right: 20px;
  top: 0;
}
.baseInfoControl >>> .el-button--text {
  color: #fff !important;
}
.second-card >>> .el-card__body {
  padding: 0 !important;
  background: #fff !important;
}
.active.second-card >>> .el-card__body {
  padding: 5px !important;
}
.image {
  width: 110px;
  line-height: 110px;
  float: left;
}
.flow-ul li {
  padding: 5px 0;
  width: 22% !important;
  white-space: nowrap;
}
</style>


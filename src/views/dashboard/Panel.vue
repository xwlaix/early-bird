<template>
  <el-row :gutter="16" class="panel-group">
    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-customer">
          <svg-icon icon-class="customer" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-text">买家数量</div>
        <div class="card-panel-description">
          <count-to
            :start-val="0"
            :end-val="+temp.group_num"
            :duration="2600"
            class="card-panel-num"
          />个
        </div>
      </div>
    </el-col>
    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-line-chart">
          <svg-icon icon-class="line-chart" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-text">市场总数</div>
        <div class="card-panel-description">
          <count-to
            :start-val="0"
            :end-val="+temp.market_num"
            :duration="3000"
            class="card-panel-num"
          />个
        </div>
      </div>
    </el-col>
    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-supplier_group">
          <svg-icon icon-class="supplier_group" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-text">激活供应商总数</div>
        <div class="card-panel-description">
          <count-to
            :start-val="0"
            :end-val="+temp.activate_supplier_num"
            :duration="3600"
            class="card-panel-num"
          />个
        </div>
      </div>
    </el-col>
    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-account-plus">
          <svg-icon icon-class="account-plus" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-text">供应商待注册</div>
        <div class="card-panel-description">
          <count-to
            :start-val="0"
            :end-val="+temp.pending_supplier_num"
            :duration="3600"
            class="card-panel-num"
          />个
        </div>
      </div>
    </el-col>
    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-trade_bill">
          <svg-icon icon-class="trade_bill" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-text">清算发票总数</div>
        <div class="card-panel-description">
          <count-to
            :start-val="0"
            :end-val="+temp.clear_invoice_num"
            :duration="3200"
            class="card-panel-num"
          />张
        </div>
      </div>
    </el-col>

    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-discount">
          <svg-icon icon-class="discount" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-text">清算发票总额</div>

        <div class="card-panel-description two_card_panel">
          <div>
            <div class="two_line">
              ￥
              <count-to
                :start-val="0"
                :end-val="+rmb.invoice_amount"
                :duration="3200"
                class="card-panel-num"
              />/
            </div>
            <div class="two_line">
              $
              <count-to
                :start-val="0"
                :end-val="+usd.invoice_amount"
                :duration="3200"
                class="card-panel-num"
              />
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-bill">
          <svg-icon icon-class="bill" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-text">清算折扣总额</div>
        <div class="card-panel-description two_card_panel">
          <div>
            <div class="two_line">
              ￥
              <count-to
                :start-val="0"
                :end-val="+rmb.discount"
                :duration="3200"
                class="card-panel-num"
              />/
            </div>
            <div class="two_line">
              $
              <count-to
                :start-val="0"
                :end-val="+usd.discount"
                :duration="3200"
                class="card-panel-num"
              />
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="6" :sm="6" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-trade">
          <svg-icon icon-class="trade" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-text">同步发票总额</div>
        <div class="card-panel-description two_card_panel">
          <div>
            <div class="two_line">
              ￥
              <count-to
                :start-val="0"
                :end-val="+rmb.sync_invoice_amount"
                :duration="3200"
                class="card-panel-num"
              />/
            </div>
            <div class="two_line">
              $
              <count-to
                :start-val="0"
                :end-val="+usd.sync_invoice_amount"
                :duration="3200"
                class="card-panel-num"
              />
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { dashboardDetail } from '@/api/dashboard'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      temp: {
        group_num: 0,
        market_num: 0,
        activate_supplier_num: 0,
        pending_supplier_num: 0,
        clear_invoice_num: 0,
        clear_info: {},
        sync_invoice_info: {}
      },
      rmb: {
        invoice_amount: 0,
        discount: 0,
        sync_invoice_amount: 0
      },
      usd: {
        invoice_amount: 0,
        discount: 0,
        sync_invoice_amount: 0
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      dashboardDetail().then(res => {
        this.temp = Object.assign({}, res.data)
        this.temp.clear_info.map((v, i) => {
          if (v.currency_sign === '$') {
            this.usd = Object.assign({}, v)
          } else if (v.currency_sign === '￥') {
            this.rmb = Object.assign({}, v)
          }
        })
        this.temp.sync_invoice_info.map((v, i) => {
          if (v.currency_sign === '$') {
            this.usd = Object.assign(this.usd, v)
          } else if (v.currency_sign === '￥') {
            this.rmb = Object.assign(this.rmb, v)
          }
        })
      })
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 16px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    // &:hover {
    //   .card-panel-icon-wrapper {
    //     color: #fff;
    //   }
    //   .icon-customer,.icon-line-chart,.icon-supplier_group {
    //      background: #40c9c6;
    //   }
    //   .icon-trade_bill ,.icon-bill, .icon-discount{
    //     background: #36a3f7;
    //   }
    //   .icon-account-plus,.icon-trade  {
    //     background: #f4516c
    //   }
    // }
    .icon-customer,
    .icon-line-chart,
    .icon-supplier_group {
      color: #40c9c6;
    }
    .icon-trade_bill,
    .icon-bill,
    .icon-discount {
      color: #36a3f7;
    }
    .icon-account-plus,
    .icon-trade {
      color: #f4516c;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 4px 0 0 22px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-text {
      position: absolute;
      white-space: nowrap;
      width: 108px;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
      font-size: 16px;
      padding-left: 12px;
      bottom: 16px;
    }
    .card-panel-description {
      height: 108px;
      line-height: 108px;
      padding-left: 108px;
      text-align: center;
      .two_line {
        white-space: nowrap;
        display: inline-block;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
<style scoped>
@media screen and (max-width: 1367px) {
   .two_card_panel{
      line-height: 24px!important;
      margin-top: 32px;
    }
}
</style>

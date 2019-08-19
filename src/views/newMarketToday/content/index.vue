<template>
  <el-card class="box-card offerDynamic" style="margin-top:5px">
    <div slot="header" class="clearfix header">
      <span>{{ name }}</span>
      <span class="operation">
        <el-tooltip class="item" effect="dark" content="开价动态" placement="bottom">
          <svg-icon
            icon-class="line-chart"
            style="color:#409EFF"
            @click="changeType('offerDynamic')"
          />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="清算漏斗" placement="bottom">
          <svg-icon
            icon-class="loudou"
            style="color:#E6A23C"
            @click="changeType('clearFunnel')"
          />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="过程监控" placement="bottom">
          <svg-icon
            icon-class="suppliersPeople"
            style="color:#E6A23C"
            @click="changeType('supplier')"
          />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="供应商分析" placement="bottom">
          <svg-icon
            icon-class="pie-chart"
            style="color:#E6A23C"
            @click="changeType('supplierPie')"
          />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="发票分析" placement="bottom">
          <svg-icon
            icon-class="discount"
            style="color:#67C23A"
            @click="changeType('invoice')"
          />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="清算记录" placement="bottom">
          <svg-icon
            icon-class="table"
            style="color:#67C23A"
            @click="changeType('clearRecord')"
          />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="操作记录" placement="bottom">
          <svg-icon
            icon-class="trade_bill"
            style="color:#F56C6C"
            @click="changeType('operationRecord')"
          />
        </el-tooltip>
      </span>
    </div>
    <div v-if="type=='offerDynamic'" class="offerDynamic">
      <div class="offerControl">
        <el-button
          :type="showStatus=='BarChart'?'danger':'info'"
          size="mini"
          @click="changeChart('BarChart')"
        >开价现状</el-button>
        <el-button
          :type="showStatus=='LineStep'?'danger':'info'"
          size="mini"
          @click="changeChart('LineStep')"
        >开价曲线</el-button>
      </div>
      <LineStep v-if="showStatus=='LineStep'" :chart-data="lineChartData" :height="height" />
      <BarChart v-if="showStatus=='BarChart'" :chart-data="barChartData" :height="height" />
    </div>
    <div v-if="type=='clearFunnel'" class="clearFunnel">
      <areaStack :chart-data="stackChartData" :height="height" />
    </div>
    <div v-if="type=='clearRecord'" class="clearRecord">
      <clearRecord :code="code" :is-fullscreen="isFullscreen" />
    </div>
    <div v-if="type=='operationRecord'" class="operationRecord">
      <operationRecord :code="code" :is-fullscreen="isFullscreen" />
    </div>
    <div v-if="type=='supplier'" class="supplier">
      <supplier :code="code" :height="height" />
    </div>
    <div v-if="type=='invoice'" class="invoice">
      <invoice :code="code" :is-fullscreen="isFullscreen" />
    </div>
    <div v-if="type=='supplierPie'" class="supplierPie">
      <supplierPie :code="code" :height="height" />
    </div>
  </el-card>
</template>

<script>
import BarChart from './BarChart'
import LineStep from './LineStep'
import areaStack from './areaStack'
import clearRecord from './clearRecord'
import operationRecord from './operationRecord'
import supplier from '../supplier/index'
import invoice from '../invoice/index'
import supplierPie from '../supplier/supplierTable'
import { current_supplier_list, invoice_stacked_area, offer_step_line } from '@/api/marketDetail'
export default {
  components: { LineStep, BarChart, areaStack, clearRecord, operationRecord, invoice, supplier, supplierPie },
  props: {
    code: {
      type: String,
      default: ''
    },
    isFullscreen: {
      type: Boolean,
      default: false
    },
    getTypeStr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      name: '',
      type: '',
      showStatus: 'BarChart',
      typeMap: {
        offerDynamic: '开价动态',
        clearRecord: '清算记录',
        operationRecord: '操作记录',
        clearFunnel: '清算漏斗',
        supplier: '过程监控',
        invoice: '发票分析',
        supplierPie: '供应商分析'
      },
      lineChartData: {
        lineData: [],
        legendData: ['买家期望年化', '买家成交年化率', '供应商平均年化率', '供应商最高开价年化率', '供应商最低开价年化率'],
        xAxisData: []
      },
      barChartData: {},
      stackChartData: {
        stackData: [],
        legendData: ['清算应付', '未清算应付', '未包括应付', '未参与应付', '未注册供应商应付'],
        xAxisData: []
      }
    }
  },
  computed: {
    height() {
      return document.body.clientHeight - (this.isFullscreen ? 165 : 265) + 'px'
    }
  },
  watch: {
    code() {
      this.changeType()
    },
    getTypeStr(val) {
      this.changeType(val)
    }
  },
  created() {
    this.changeType(this.getTypeStr || 'offerDynamic')
  },
  methods: {
    changeChart(type) {
      this.showStatus = type
      if (this.showStatus === 'BarChart') {
        this.getSupplierBarChart()
      }
      if (this.showStatus === 'LineStep') {
        this.getLineStepChart()
      }
    },
    changeType(type) {
      if (type) {
        this.type = type
        this.name = this.typeMap[type]
      }
      this.$emit('getType', type)
      switch (this.type) {
        case 'offerDynamic':
          if (this.showStatus === 'BarChart') {
            this.getSupplierBarChart()
          }
          if (this.showStatus === 'LineStep') {
            this.getLineStepChart()
          }
          break
        case 'clearFunnel':
          this.type = ''
          this.getStackChartData()
          break

        default:

          break
      }
    },
    getStackChartData(type) {
      this.stackChartData.xAxisData = []
      this.stackChartData.stackData = [[], [], [], [], []]
      invoice_stacked_area({ market_code: this.code }).then(res => {
        for (const [key, value] of Object.entries(res.data)) {
          this.stackChartData.xAxisData.push(key)
          for (const [index, elem] of value.entries()) {
            this.stackChartData.stackData[index].push(elem)
          }
        }
        this.type = 'clearFunnel'
      })
    },
    getLineStepChart() {
      this.type = ''
      this.lineChartData.lineData = [[], [], [], [], []]
      this.lineChartData.xAxisData = []
      offer_step_line({ market_code: this.code }).then(res => {
        for (const [key, value] of Object.entries(res.data)) {
          this.lineChartData.xAxisData.push(key)
          for (const [index, elem] of value.entries()) {
            this.lineChartData.lineData[index].push(elem)
          }
        }
        this.type = 'offerDynamic'
      })
    },
    getSupplierBarChart() {
      if (!this.code) {
        return false
      }
      current_supplier_list({ market_code: this.code, is_participation: 1 }).then(res => {
        this.barChartData = Object.assign({}, res.data)
      })
    }
  }
}
</script>
<style scoped>
.operation {
  float: right;
  margin-right: 10px;
}
.operation .svg-icon {
  margin-right: 10px;
}
.offerDynamic {
  position: relative;
}
.offerDynamic >>> .el-card__body {
  padding: 0!important;
  background: rgba(66, 62, 80, 0.05);
}
.offerDynamic .operationRecord >>> .el-card__body {
  padding: 5px!important;
  background: rgba(66, 62, 80, 0.05);
}
.offerControl {
  position: absolute;
  top: 5px;
  z-index: 100;
  left: 50%;
  margin-left:-97px;
}
</style>


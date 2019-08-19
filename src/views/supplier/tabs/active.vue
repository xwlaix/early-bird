<template>
  <div>
    <div class="table-container market_container">
      <el-date-picker
        v-model="time"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="~"
        start-placeholder="选择开始日期"
        unlink-panels
        end-placeholder="结束日期"
        class="filter-item"
        size="small"
      />
      <el-select v-model="listQuery.operation_type" class="filter-item" filterable size="small" placeholder="请选择客户">
        <el-option
          v-for="item in typeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button size="small" type="primary" class="filter-item" icon="el-icon-search" @click="fetchData" />
      <el-button size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh" />
    </div>
    <lineChart :chart-data="chartData" :height="height" class="lineChart" ref="chart"/>
  </div>
</template>

<script>
import { market_operation } from '@/api/marketBuyer'
import lineChart from './lineChart'

export default {
  components: {
    lineChart
  },
  props: {
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
      market_code: '',
      time: '',
      listQuery: {
        market_code: '',
        start_date: '',
        end_date: '',
        operation_type: '',
        page: 1,
        size: 10
      },
      chartData: {
        legendData: ['月登陆次数', '月参与次数', '月清算次数'],
        xAxisData: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
        lineData: {
          0: [1, 2, 3, 4, 5, 6, 7],
          1: [2, 2, 1, 4, 3, 8, 5],
          2: [12, 7, 4, 7, 9, 11, 5]
        }
      },
      typeArr: [
        {
          value: 'upload_payment',
          label: '上传应付'
        }, {
          value: 'upload_supplier',
          label: '上传供应商'
        }, {
          value: 'upload_user',
          label: '上传供应商用户'
        }, {
          value: 'modifiy_setting',
          label: '修改资金池'
        }, {
          value: 'add_plan',
          label: '添加计划'
        }, {
          value: 'modify_plan',
          label: '修改计划'
        }, {
          value: 'delete_plan',
          label: '删除计划'
        }, {
          value: 'open_market',
          label: '打开市场'
        }, {
          value: 'close_market',
          label: '关闭市场'
        }
      ]
    }
  },
  computed: {
    height() {
      if (this.status) {
        return `${document.body.clientHeight - 419}px`
      } else {
        return `${document.body.clientHeight - 301}px`
      }
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'active') {
          this.market_code = this.value.name
          this.$refs.chart.chart.resize()
        }
      }
    },
    market_code() {
      this.fetchData()
    },
    time(val) {
      if (val) {
        this.listQuery.start_date = val[0]
        this.listQuery.end_date = val[1]
      }
    }
  },
  created() {
    this.market_code = this.value.name
  },
  methods: {
    handleRefresh() {
      this.listQuery = {
        operation_type: '',
        start_date: '',
        end_date: '',
        page: 1,
        size: 10
      }
      this.time = []
      this.fetchData()
    },

    fetchData() {
      this.listQuery.market_code = this.value.name
      market_operation(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.data_count
      })
    }
  }
}
</script>
<style scoped>
.lineChart{
  margin-top:20px;
}
</style>


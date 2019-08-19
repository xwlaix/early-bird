<template>
  <div>
    <div class="table-container">
      <el-date-picker
        v-model="time"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        unlink-panels
        end-placeholder="结束日期"
        size="small"
      />
      <el-button size="small" type="primary" icon="el-icon-search" @click="fetchData" />
      <el-button size="small" type="success" icon="el-icon-refresh" @click="handleRefresh" />
    </div>
    <iTable
      :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)"
      :max-height="height"
      :height="height"
      :col-configs="configs"
      class="dynamic"
      row-key="id"
    >
      <el-table-column slot="market_status" show-overflow-tooltip label="市场状态" min-width="100px" align="center">
        <template slot-scope="scope">
          {{ market_status[scope.row.market_status] }}
        </template>
      </el-table-column>
    </iTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { marketStatDynamic } from '@/api/marketDetail'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: {
    iTable,
    Pagination
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
      list: [],
      total: 0,
      market_status: {
        '-5': '市场停用',
        '-4': '未初始化',
        '-3': '无可清算',
        '-2': '资金不足',
        '-1': '买家关闭',
        0: '次日开市',
        1: '活跃交易'
      },
      configs: [
        { prop: 'total_invoice', label: '有效发票数量', minWidth: '100px' },
        { prop: 'create_time', label: '时间', minWidth: '100px' },
        { slot: 'market_status' },
        { prop: 'available_cash', label: '现金余额', numFormat: true, minWidth: '110px' },
        { prop: 'total_amount', label: '有效应付', numFormat: true, minWidth: '110px' }
      ],
      market_code: '',
      time: '',
      listQuery: {
        market_code: '',
        start_date: '',
        end_date: '',
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    height() {
      return document.body.clientHeight - 433 + (this.status ? 0 : 120)
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'dynamic') {
          this.market_code = this.value.name
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
      marketStatDynamic(this.listQuery, '.dynamic').then(res => {
        this.list = res.data
        this.total = res.data.length
      })
    }
  }
}
</script>


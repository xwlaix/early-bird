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
      :max-height="height"
      :height="height"
      :data="list"
      :col-configs="configs"
      class="illegal"
      row-key="id"
    />
    <div v-if="total>0" class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.size"
        :pager-count="5"
        :total="total"
        background
        layout="total, sizes,jumper, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { overdue } from '@/api/marketBuyer'
import iTable from '@/components/Table'

export default {
  components: {
    iTable
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
      configs: [
        { prop: 'pay_date', label: '应付日期', minWidth: '100px' },
        { prop: 'pay_amount', label: '清算应付金额', numFormat: true, minWidth: '100px' },
        { prop: 'over_amount', label: '逾期金额', numFormat: true, minWidth: '100px' },
        { prop: 'pay_invoice', label: '应付发票数量', minWidth: '100px' },
        { prop: 'over_invoice', label: '逾期应付发票数量', minWidth: '100px' },
        { prop: 'charge_user', label: '市场负责人', minWidth: '110px' },
        { prop: 'due_date', label: '标记时间', minWidth: '110px' }
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
      return document.body.clientHeight - 433 + (this.status ? 0 : 142)
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'illegal') {
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
    handleSizeChange(val) {
      this.listQuery.size = val
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
    },
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
      overdue(this.listQuery, '.illegal').then(res => {
        this.list = res.data
        this.total = res.data.length
      })
    }
  }
}
</script>

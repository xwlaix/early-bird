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
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="fetchData"
      />
      <el-button
        size="small"
        type="success"
        icon="el-icon-refresh"
        @click="handleRefresh"
      />
    </div>
    <iTable
      ref="planTable"
      :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)"
      :max-height="height"
      :height="height"
      :col-configs="configs"
      :show-header="false"
      highlight-current-row
      row-class-name="table-bg"
      class="plan"
      row-key="id"
      @row-click="handleChange"
    >
      <el-table-column slot="id" show-overflow-tooltip min-width="120px" align="center">
        <template slot-scope="scope">
          <svg-icon icon-class="note" style="font-size:20px;" />
          计划编号：{{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column slot="plan_amount" show-overflow-tooltip min-width="100px" align="center">
        <template slot-scope="scope">资金计划金额：{{ scope.row.plan_amount }}</template>
      </el-table-column>
      <el-table-column slot="plan_date" show-overflow-tooltip min-width="100px" align="center">
        <template slot-scope="scope">计划日期：{{ scope.row.plan_date }}</template>
      </el-table-column>
      <el-table-column slot="status" show-overflow-tooltip min-width="100px" align="center">
        <template slot-scope="scope">状态：{{ statusMap[scope.row.status] }}</template>
      </el-table-column>
      <el-table-column slot="operation" type="expand" min-width="100px">
        <template slot-scope="scope">
          <planClear :plan-id="scope.row.id" :market-code="listQuery.market_code" />
        </template>
      </el-table-column>
    </iTable>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { marketCashpoolPlan } from '@/api/marketDetail'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import planClear from '../dialogTable/planClear'

export default {
  components: {
    iTable,
    Pagination,
    planClear
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
      oldList: [],
      total: 0,
      index: 0,
      statusMap: {
        0: '待启用',
        1: '已启用',
        2: '已作废',
        3: '已结算'
      },
      configs: [
        { slot: 'operation' },
        { slot: 'id' },
        { slot: 'plan_amount' },
        { slot: 'plan_date' },
        { slot: 'status' }
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
        if (val.active === 'plan') {
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
    handleChange(row, column) {
      this.index = column
      this.$refs.planTable.$children[0].toggleRowExpansion(row)
      if (this.list[0].id === row.id && this.list.length === 1) {
        this.list = this.oldList
        const arr = Array.from(document.getElementsByClassName('table-bg'))
        setTimeout(() => {
          arr[0].scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          })
        }, 500)
      } else {
        this.list = [row]
      }
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
      marketCashpoolPlan(this.listQuery, '.plan').then(res => {
        this.list = res.data
        this.oldList = [...res.data]
        this.total = this.list.length
      })
    }
  }
}
</script>
<style scoped>
.plan >>> .el-table {
  padding: 0 !important;
}
.plan >>> .el-table__expanded-cell {
  padding: 10px !important;
  background-color: #d4d4d4;
}
.plan >>> .el-table__expanded-cell:hover > td,.plan >>> .el-table__expanded-cell:hover{
  background-color: #d4d4d4!important;
}
</style>


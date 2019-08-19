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
      class="clear"
      row-key="id"
    >
      <el-table-column slot="operation" show-overflow-tooltip label="操作" min-width="200px">
        <template slot-scope="scope">
          <el-button
            v-permission="['market:money:detail:suppliers']"
            type="primary"
            size="mini"
            @click="handleJump(scope.row,'supplier')"
          >供应商明细</el-button>
          <el-button
            v-permission="['market:money:detail:invoice']"
            type="success"
            size="mini"
            @click="handleJump(scope.row,'invoice')"
          >发票明细</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="need_pay_amount" show-overflow-tooltip label="折后应付金额" min-width="100px">
        <template slot-scope="scope">
          {{ numFormat((scope.row.clear_amount - scope.row.clear_discount).toFixed(2)) }}
        </template>
      </el-table-column>
    </iTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
    <el-dialog
      :visible.sync="dialogFormVisible"
      :title="textMap[dialogStatus]"
      :modal="false"
      width="970px"
      top="50px"
      custom-class="dialogFull"
    >
      <invoiceDetail v-if="dialogStatus=='invoice'" :id="id" ref="dataForm" />
      <supplierDetail v-if="dialogStatus=='supplier'" :id="id" ref="dataForm" />
    </el-dialog>
  </div>
</template>

<script>
import { marketHistoryList } from '@/api/marketDetail'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import invoiceDetail from '../dialogTable/invoiceDetail'
import supplierDetail from '../dialogTable/supplierDetail'
import { numFormat } from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  components: {
    iTable,
    Pagination,
    supplierDetail,
    invoiceDetail
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
      time: '',
      market_code: '',
      configs: [
        { slot: 'operation' },
        { prop: 'award_date', label: '清算日期', minWidth: '90px' },
        { prop: 'clear_amount', label: '清算应付金额', numFormat: true, minWidth: '100px' },
        { slot: 'need_pay_amount' },
        { prop: 'clear_discount', label: '折扣金额', numFormat: true, minWidth: '100px' },
        { prop: 'avg_discount', label: '平均折扣率(%)', minWidth: '100px' },
        { prop: 'avg_apr', label: '平均年化率(%)', minWidth: '100px' },
        { prop: 'clear_vendor', label: '清算供应商数量', minWidth: '100px' },
        { prop: 'clear_invoice', label: '清算发票数量', minWidth: '100px' },
        { prop: 'paydate', label: '早付日期', minWidth: '90px' },
        { prop: 'create_user', label: '归属销售', minWidth: '90px' }
      ],
      listQuery: {
        market_code: '',
        start_date: '',
        end_date: '',
        page: 1,
        size: 10
      },
      textMap: {
        supplier: '供应商明细',
        invoice: '发票明细'
      },
      id: '',
      dialogFormVisible: false,
      dialogStatus: ''
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
        if (val.active === 'clear') {
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
    numFormat,
    handleJump(row, type) {
      this.dialogFormVisible = true
      this.id = row.id
      this.dialogStatus = type
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
      marketHistoryList(this.listQuery, '.clear').then(res => {
        this.list = res.data
        this.total = res.data.length
      })
    }
  }
}
</script>

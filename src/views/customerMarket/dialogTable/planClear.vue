<template>
  <div>
    <iTable
      v-if="total>0"
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
          ><span class="vendor">{{ scope.row.clear_vendor }}</span>供应商明细</el-button>
          <el-button
            v-permission="['market:money:detail:invoice']"
            type="success"
            size="mini"
            @click="handleJump(scope.row,'invoice')"
          >发票明细</el-button>
        </template>
      </el-table-column>
      <el-table-column slot="clear_amount" show-overflow-tooltip label="清算应付金额/发票数量" min-width="135px">
        <template slot-scope="scope">
          {{ numFormat(scope.row.clear_amount) }} / {{ scope.row.clear_invoice }}
        </template>
      </el-table-column>
    </iTable>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" /> -->
    <div v-if="total==0" style="text-align:center;">暂无数据</div>
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
import { marketCashpoolPlanDetail } from '@/api/marketDetail'
import iTable from '@/components/Table'
import invoiceDetail from './invoiceDetail'
import supplierDetail from './supplierDetail'
import { numFormat } from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  directives: { elDragDialog },
  components: {
    iTable,
    supplierDetail,
    invoiceDetail
  },
  props: {
    planId: {
      type: String,
      required: true
    },
    marketCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      configs: [
        { slot: 'operation' },
        { prop: 'award_date', label: '清算日期', minWidth: '75px' },
        { prop: 'paydate', label: '早付日期', minWidth: '75px' },
        { slot: 'clear_amount' },
        { prop: 'clear_discount', label: '折扣金额', numFormat: true, minWidth: '90px' },
        { prop: 'avg_apr', label: '平均年化率', minWidth: '90px' },
        { prop: 'avg_dpe', label: '平均早付天数', minWidth: '90px' }
      ],
      listQuery: {
        market_id: '',
        plan_id: '',
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
      return 40 * (1 + this.total)
    }
  },
  watch: {
    plan_id() {
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    numFormat,
    handleJump(row, type) {
      this.dialogFormVisible = true
      this.id = row.id
      this.dialogStatus = type
    },
    fetchData() {
      this.listQuery.market_id = this.marketCode
      this.listQuery.plan_id = this.planId
      marketCashpoolPlanDetail(this.listQuery).then(res => {
        this.list = res.data
        this.total = res.data.length
      })
    }
  }
}
</script>
<style scoped>
.vendor{
  font-weight: bold;
  margin-right: 5px;
}
</style>


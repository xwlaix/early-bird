<template>
  <div>
    <iTable :max-height="height" :height="height" :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)" :col-configs="configs" class="invoiceDetail" row-key="id">
      <el-table-column slot="amount" show-overflow-tooltip label="清算应付金额(总金额/数量)" align="center" min-width="200px">
        <template slot-scope="scope">
          {{ numFormat(scope.row.clear_amount) }} / {{ numFormat(scope.row.clear_invoice) }}
        </template>
      </el-table-column>
      <el-table-column slot="time" show-overflow-tooltip label="早付日期/平均早付天数" align="center" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.paydate }} / {{ scope.row.avg_dpe }}
        </template>
      </el-table-column>
    </iTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { history_supplier_detail } from '@/api/marketDetail'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { numFormat } from '@/utils'

export default {
  components: {
    iTable,
    Pagination
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      height: document.body.clientHeight - 462,
      code: '',
      list: [],
      configs: [
        { slot: 'amount' },
        { slot: 'time' },
        { prop: 'award_date', label: '清算日期', minWidth: '90px' },
        { prop: 'supplier', label: '供应商名称', minWidth: '90px' },
        { prop: 'vendor_code', label: '供应商编号', minWidth: '90px' },
        { prop: 'offer_value', label: '开价年化率(%)', minWidth: '90px' },
        { prop: 'avg_apr', label: '成交年化率(%)', minWidth: '90px' },
        { prop: 'clear_discount', label: '折扣金额', numFormat: true, minWidth: '80px' }
      ],
      total: 0,
      listQuery: {
        id: '',
        page: 1,
        size: 10
      }
    }
  },
  watch: {
    id() {
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    numFormat,
    fetchData() {
      this.listQuery.id = this.id
      history_supplier_detail(this.listQuery, '.invoiceDetail').then(res => {
        this.list = res.data
        this.total = res.data.length
      }).catch(() => {
        this.list = []
        this.total = 0
      })
    }
  }
}
</script>



<template>
  <div>
    <iTable :max-height="height" :height="height" :data="list" :col-configs="configs" class="invoiceDetail" row-key="id">
      <el-table-column slot="name" show-overflow-tooltip label="供应商负责人" align="center" min-width="120pxs">
        <template slot-scope="scope">
          {{ scope.row.last_name }} {{ scope.row.first_name }}
        </template>
      </el-table-column>
      <el-table-column slot="status" show-overflow-tooltip label="发票状态" align="center" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.status === 0 ? "未付款" :scope.row.status === 1 ? "已付款" : "无效" }}
        </template>
      </el-table-column>
    </iTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { payward_list } from '@/api/marketClearing'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'MarketClearingInvoiceDetail',
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
      height: document.body.clientHeight - 34 - 216,
      code: '',
      list: [],
      configs: [
        { slot: 'status' },
        { slot: 'name' },
        { prop: 'invoice_no', label: '应付发票编号', minWidth: '120px' },
        { prop: 'invoice_amount', label: '应付发票金额', numFormat: true, minWidth: '120px' },
        { prop: 'pay_amount', label: '折后应付金额', numFormat: true, minWidth: '120px' },
        { prop: 'discount_avg', label: '折扣率(%)', minWidth: '100px' },
        { prop: 'discount', label: '折扣金额', numFormat: true, minWidth: '100px' },
        { prop: 'supplier_name', label: '供应商名称', minWidth: '100px' }
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
    fetchData() {
      this.listQuery.id = this.id
      payward_list(this.listQuery, '.invoiceDetail').then(res => {
        this.list = res.data.list
        this.total = res.data.data_count
      })
    }
  }
}
</script>



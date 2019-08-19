<template>
  <div>
    <iTable :max-height="height" :height="height" :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)" :col-configs="configs" class="invoiceDetail" row-key="id" />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { history_invoice_detail } from '@/api/marketDetail'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

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
      list: [],
      configs: [
        { prop: 'award_date', label: '清算日期', minWidth: '130px' },
        { prop: 'invoice_no', label: '应付发票编号', minWidth: '130px' },
        { prop: 'invoice_amount', label: '应付发票金额', numFormat: true, minWidth: '130px' },
        { prop: 'discount', label: '折扣金额', numFormat: true, minWidth: '100px' },
        { prop: 'dpe', label: '早付天数', minWidth: '100px' },
        { prop: 'est_paydate', label: '原定付款日期', minWidth: '100px' },
        { prop: 'paydate', label: '早付日期', minWidth: '100px' }
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
      history_invoice_detail(this.listQuery, '.invoiceDetail').then(res => {
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


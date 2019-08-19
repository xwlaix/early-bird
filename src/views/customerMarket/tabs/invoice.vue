<template>
  <div>
    <div class="table-container market_container">
      <el-input
        v-model.trim="listQuery.search_key"
        size="small"
        clearable
        class="filter-item name"
        placeholder="发票编号/供应商名字/发票状态"
        style="width:150px;"
        @clear="fetchData"
      />
      <el-button size="small" type="primary" icon="el-icon-search" @click="fetchData" />
      <el-button size="small" type="success" icon="el-icon-refresh" @click="handleRefresh" />
    </div>
    <iTable :max-height="height" :height="height" :data="list" :col-configs="configs" class="invoiceDetail" row-key="id">
      <el-table-column slot="status" show-overflow-tooltip label="状态" min-width="100px" align="center">
        <template slot-scope="scope">
          {{ scope.row.invoice_status==1?'正常':'供应商授权用户' }}
        </template>
      </el-table-column>
    </iTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { marketInvoiceList } from '@/api/marketDetail'
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
      configs: [
        { prop: 'est_paydate', label: '原定付款日期', minWidth: '100px' },
        { prop: 'invoice_no', label: '发票编号', minWidth: '130px' },
        { prop: 'supplier_name', label: '供应商名称', minWidth: '130px' },
        { prop: 'invoice_amount', label: '发票金额', numFormat: true, minWidth: '130px' },
        { prop: 'create_time', label: '同步发票时间', numFormat: true, minWidth: '130px' },
        { slot: 'status' }
      ],
      total: 0,
      market_code: '',
      listQuery: {
        search_key: '',
        market_code: '',
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    height() {
      return document.body.clientHeight - 433 + (this.status ? 0 : 130)
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'invoice') {
          this.market_code = this.value.name
        }
      }
    },
    market_code() {
      this.fetchData()
    }
  },
  created() {
    this.market_code = this.value.name
  },
  methods: {
    handleRefresh() {
      this.listQuery.search_key = ''
      this.listQuery.page = 1
      this.listQuery.size = 10
      this.fetchData()
    },
    fetchData() {
      this.listQuery.market_code = this.value.name
      marketInvoiceList(this.listQuery, '.invoiceDetail').then(res => {
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

<template>
  <div>
    <iTable :max-height="height" :height="height" :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)" :col-configs="configs" class="market_act_list" row-key="id" />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { current_stat_list } from '@/api/marketDetail'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'MarketClearingInvoiceDetail',
  components: {
    iTable,
    Pagination
  },
  data() {
    return {
      height: document.body.clientHeight - 34 - 50 - 32 - 248 - 32 - 40 - 7,
      list: [],
      configs: [
        { prop: 'valid_vendor', label: '参与供应商', minWidth: '100px' },
        { prop: 'market_name', label: '市场名称', minWidth: '160px' },
        { prop: 'available_cash', label: '现金余额', numFormat: true, minWidth: '120px' },
        { prop: 'total_amount', label: '所有应付总金额', numFormat: true, minWidth: '120px' },
        { prop: 'total_invoice', label: '所有应付发票数量', minWidth: '120px' },
        { prop: 'valid_amount', label: '有效应付发票总金额', numFormat: true, minWidth: '120px' },
        { prop: 'valid_invoice', label: '有效应付发票数量', minWidth: '120px' },
        { prop: 'clear_amount', label: '可清算发票总金额', numFormat: true, minWidth: '120px' },
        { prop: 'clear_discount', label: '可清算发票折扣金额', numFormat: true, minWidth: '120px' },
        { prop: 'avg_apr', label: '可清算发票平均年化率', per: true, minWidth: '150px' },
        { prop: 'noclear_amount', label: '无可清算发票总金额', numFormat: true, minWidth: '120px' },
        { prop: 'noclear_invoice', label: '无可清算发票数量', minWidth: '120px' }
      ],
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      current_stat_list(this.listQuery, '.market_act_list').then(res => {
        this.list = res.data
        this.total = res.data.length
      })
    }
  }
}
</script>


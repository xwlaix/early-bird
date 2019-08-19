<template>
  <div>
    <iTable :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)" :max-height="height" :height="height" :col-configs="configs" style="margin:0 auto;" row-key="id" class="clearRecord">
      <el-table-column slot="sumValue" show-overflow-tooltip label="市场价值（总金额/数量）" min-width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.currency_sign }}{{ numFormat(scope.row.valid_amount) }}</span> / <span>{{ scope.row.valid_invoice }}</span>
        </template>
      </el-table-column>
    </iTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { market_stat_log } from '@/api/marketDetail'
import { numFormat } from '@/utils'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: {
    iTable,
    Pagination
  },
  props: {
    code: {
      type: String,
      default: ''
    },
    isFullscreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      configs: [
        { prop: 'avg_apr', label: '平均年化率', per: true, minWidth: '90px' },
        { prop: 'create_time', label: '计算时间', minWidth: '120px' },
        { slot: 'sumValue' },
        { prop: 'available_cash', label: '现金余额', numFormat: true, minWidth: '90px' },
        { prop: 'clear_amount', label: '清算应付', numFormat: true, minWidth: '90px' },
        { prop: 'valid_avg_apr', label: '平均供应商开价', per: true, minWidth: '90px' },
        { prop: 'clear_discount', label: '折扣金额', numFormat: true, minWidth: '90px' },
        { prop: 'avg_discount', label: '平均折扣率', per: true, minWidth: '90px' }
      ],
      total: 0,
      listQuery: {
        market_code: '',
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    height() {
      return document.body.clientHeight - (this.isFullscreen ? 208 : 303) + 'px'
    }
  },
  //   computed: {
  //   market_status() {
  //     return this.$store.state.tempData.market_status
  //   },
  //   hash_list() {
  //     return this.$store.state.tempData.hash_list
  //   }
  // },
  watch: {
    code(val) {
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    numFormat,
    fetchData() {
      this.listQuery.market_code = this.code

      if (this.listQuery.market_code) {
        market_stat_log(this.listQuery, '.clearRecord').then(res => {
          this.list = res.data
          this.total = res.data.length
        })
      }
    }
  }
}
</script>


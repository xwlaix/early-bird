<template>
  <div>
    <iTable
      :max-height="height"
      :height="height"
      :data="list"
      :col-configs="configs"
      class="offer"
      row-key="id"
    >
      <el-table-column
        slot="market_status"
        show-overflow-tooltip
        label="市场状态"
        min-width="100px"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.is_participation==1?'参与':'非参与' }}</template>
      </el-table-column>
      <el-table-column
        slot="min_amount"
        show-overflow-tooltip
        label="最低收款线"
        min-width="100px"
        align="center"
      >
        <template
          slot-scope="scope"
        >{{ scope.row.min_amount>0 ?numFormat(scope.row.min_amount):'无限制' }}</template>
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
import { marketSupplierOffer } from '@/api/marketDetail'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { numFormat } from '@/utils'

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
      total: 0,
      configs: [
        { slot: 'market_status' },
        { prop: 'supplier', label: '供应商名称', minWidth: '100px' },
        { prop: 'offer_value', label: '开价年化率', minWidth: '80px' },
        { slot: 'min_amount' },
        {
          prop: 'valid_amount',
          label: '应收机会',
          numFormat: true,
          minWidth: '120px'
        },
        {
          prop: 'clear_amount',
          label: '清算金额',
          numFormat: true,
          minWidth: '100px'
        },
        {
          prop: 'clear_discount',
          label: '折扣金额',
          numFormat: true,
          minWidth: '100px'
        },
        { prop: 'avg_apr', label: '平均年化率', minWidth: '100px' }
      ],
      market_code: '',
      listQuery: {
        market_code: '',
        page: 1,
        size: 10
      },
      market_status: {
        '-5': '市场停用',
        '-4': '未初始化',
        '-3': '无可清算',
        '-2': '资金不足',
        '-1': '买家关闭',
        0: '次日开市',
        1: '活跃交易'
      }
    }
  },
  computed: {
    height() {
      return document.body.clientHeight - 433 + 53 + (this.status ? 0 : 120)
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'offer') {
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
    numFormat,
    handleRefresh() {
      this.listQuery = {
        operation_type: '',
        page: 1,
        size: 10
      }
      this.fetchData()
    },

    fetchData() {
      this.listQuery.market_code = this.value.name
      marketSupplierOffer(this.listQuery, '.offer').then(res => {
        this.list = res.data
        this.total = res.data.length
      })
    }
  }
}
</script>

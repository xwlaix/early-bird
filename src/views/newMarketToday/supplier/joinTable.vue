<template>
  <div>
    <iTable
      :max-height="infactHeight"
      :height="infactHeight"
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
      <el-table-column
        slot="valid_per"
        show-overflow-tooltip
        label="应收市值占比"
        min-width="100px"
        align="center"
      >
        <template
          slot-scope="scope"
        >{{ +scope.row.valid_amount&&+scope.row.market_amount?((scope.row.valid_amount/scope.row.market_amount)*100).toFixed(2):'0.00' }}</template>
      </el-table-column>
      <el-table-column
        slot="clear_per"
        show-overflow-tooltip
        label="清算金额占比"
        min-width="100px"
        align="center"
      >
        <template
          slot-scope="scope"
        >{{ +scope.row.clear_amount&&+scope.row.valid_amount?((scope.row.clear_amount/scope.row.valid_amount)*100).toFixed(2):'0.00' }}</template>
      </el-table-column>
      <el-table-column
        slot="noclear_per"
        show-overflow-tooltip
        label="未清算金额市值占比"
        min-width="120px"
        align="center"
      >
        <template
          slot-scope="scope"
        >{{ +scope.row.noclear_amount&&+scope.row.valid_amount?((scope.row.noclear_amount/scope.row.valid_amount)*100).toFixed(2):'0.00' }}</template>
      </el-table-column>
    </iTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" layout="total, prev, pager, next, jumper" @pagination="fetchData" />
  </div>
</template>

<script>
import { marketSupplierOffer } from '@/api/marketDetail'
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
    height: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      configs: [
        { slot: 'market_status' },
        { prop: 'supplier', label: '供应商名称', minWidth: '100px' },
        { prop: 'offer_value', label: '开价年化率', minWidth: '80px' },
        { slot: 'min_amount' },
        {
          prop: 'valid_amount',
          label: '应收机会',
          numFormat: true,
          minWidth: '100px'
        },
        {
          slot: 'valid_per'
        },
        {
          prop: 'clear_amount',
          label: '清算金额',
          numFormat: true,
          minWidth: '100px'
        },
        {
          slot: 'clear_per'
        },
        {
          prop: 'noclear_amount',
          label: '未清算金额',
          numFormat: true,
          minWidth: '100px'
        },
        {
          slot: 'noclear_per'
        }
      ],
      total: 0,
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
    infactHeight() {
      return this.height.replace('px', '') - 46
    }
  },
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
      this.listQuery.size = Math.floor(this.infactHeight / 36) - 1
      marketSupplierOffer(this.listQuery, '.offer').then(res => {
        this.list = res.data
        this.total = res.data.length
      })
    }
  }
}
</script>
<style scoped>
.table-container{
  padding-bottom: 0;
}
</style>


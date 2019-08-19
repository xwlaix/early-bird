<template>
  <div>
    <div class="table-container">
      <el-select v-model="listQuery.vendor_code" filterable class="filter-item" size="mini" style="width:120px" placeholder="请选择供应商" @change="fetchData">
        <el-option
          v-for="(value, key) in supplierArr"
          :key="key"
          :label="value"
          :value="key"
        />
      </el-select>
      <el-select v-model="listQuery.judge" filterable class="filter-item" size="mini" style="width:150px" placeholder="请选择判断类型" @change="fetchData">
        <el-option
          v-for="item in type"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button size="mini" type="primary" class="filter-item" icon="el-icon-search" @click="fetchData" />
      <el-button size="mini" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh" />
    </div>
    <iTable :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)" :max-height="height" :height="height" :col-configs="configs" style="margin:0 auto;" row-key="id">
      <!-- <el-table-column slot="sumValue" show-overflow-tooltip label="市场价值（总金额/数量）" min-width= "130px">
        <template slot-scope="scope">
          <span>{{ scope.row.currency_sign }}{{ numFormat(scope.row.total_amount) }}</span> / <span>{{ scope.row.total_invoice }}</span>
        </template>
      </el-table-column> -->
    </iTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" layout="total, prev, pager, next, jumper" @pagination="fetchData" />
  </div>
</template>

<script>
import { numFormat } from '@/utils'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: {
    iTable,
    Pagination
  },
  props: {
    data: {
      type: Object,
      default: null
    },
    judge: {
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
        // { prop: 'status', label: '发票状态', minWidth: '80px' },
        // { slot: 'sumValue' },
        { prop: 'invoice_no', label: '发票编号', minWidth: '80px' },
        { prop: 'invoice_amount', label: '发票金额', numFormat: true, minWidth: '80px' },
        { prop: 'percent', label: '金额市值占比', minWidth: '80px' },
        { prop: 'supplier_name', label: '供应商名称', minWidth: '80px' },
        { prop: 'est_paydate', label: '发票原定付款日', minWidth: '80px' },
        { prop: 'est_paydate', label: '开价年化率', minWidth: '80px' },
        { prop: 'est_paydate', label: '早付天数', minWidth: '80px' },
        { prop: 'participation_time', label: '历史参与清算次数', minWidth: '100px' }
      ],
      total: 0,
      type: [],
      listType: '',
      type1Arr: [
        {
          value: '1',
          label: '参与供应商'
        }, {
          value: '0',
          label: '不参与供应商'
        }
      ],
      type2Arr: [
        {
          value: '1',
          label: '被包含发票'
        }, {
          value: '0',
          label: '被排除发票'
        }
      ],
      type3Arr: [
        {
          value: '1',
          label: '选中发票'
        }, {
          value: '0',
          label: '落选发票'
        }
      ],
      supplierArr: [],
      listQuery: {
        vendor_code: '',
        judge: '',
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    height() {
      return document.body.clientHeight - (this.isFullscreen ? 165 : 260) - 82
    }
  },
  watch: {
    judge(val) {
      if (val === 'is_offered') {
        this.type = this.type1Arr
        this.supplierArr = this.data
        this.listType = 'valid'
        this.fetchData()
      }
      if (val === 'is_included') {
        this.type = this.type2Arr
        this.supplierArr = this.data
        this.listType = 'offer'
        this.fetchData()
      }
      if (val === 'is_awarded') {
        this.type = this.type3Arr
        this.supplierArr = this.data
        this.listType = 'include'
        this.fetchData()
      }
    },
    data() {
      this.fetchData()
    }
  },
  created() {
    this.type = this.type1Arr
    this.listType = 'valid'
  },
  methods: {
    numFormat,
    handleRefresh() {
      this.listQuery.vendor_code = ''
      this.listQuery.judge = ''
      this.listQuery.page = 1
      this.fetchData()
    },
    fetchData() {
      if (!this.data) {
        return
      }
      this.listQuery.size = Math.floor(this.height / 36) - 1
      this.list = this.data[this.listType].list.filter(v => {
        if (this.listQuery.vendor_code && v.vendor_code === this.listQuery.vendor_code) {
          if (this.listQuery.judge && +v[this.judge || 'is_offered'] === +this.listQuery.judge) {
            return true
          } else if (!this.listQuery.judge) {
            return true
          }
        } else if (!this.listQuery.vendor_code) {
          if (this.listQuery.judge && +v[this.judge || 'is_offered'] === +this.listQuery.judge) {
            return true
          } else if (!this.listQuery.judge) {
            return true
          }
        }
      })
      this.supplierArr = this.data[this.listType].vendor
      this.total = this.list.length
    }
  }
}
</script>
<style scoped>
.table-container{
  padding-bottom: 0;
}
</style>


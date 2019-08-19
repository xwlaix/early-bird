<template>
  <div>
    <iTable
      id="supplierTable"
      ref="supplierTable"
      :max-height="height"
      :height="height"
      :data="list"
      :show-header="false"
      :col-configs="configs"
      highlight-current-row
      row-class-name="table-select"
      class="supplier"
      row-key="vendor_code"
      style="padding:0!important;"
      @row-click="handleChange"
    >
      <!-- @handleChange="handleChange" -->
      <el-table-column slot="one" show-overflow-tooltip align="left">
        <template slot-scope="scope">
          <svg-icon icon-class="build" class="svg_bg" />
          {{ scope.row.supplier_name }}
          <br>
          供应商编号：{{ scope.row.vendor_code }}
          <br>
          应收部门电邮：{{ scope.row.relevancy_email }}
        </template>
      </el-table-column>
      <el-table-column slot="two" show-overflow-tooltip align="left">
        <template slot-scope="scope">
          有效状态：√
          <br>
          有效发票：{{ scope.row.invoice_count }}
          <br>
          参与状态：{{ scope.row.is_participaton==1?'参与开价':'不参与开价' }}
          <br>
          行业：{{ scope.row.industry }}
        </template>
      </el-table-column>
      <el-table-column slot="three" show-overflow-tooltip align="left">
        <template slot-scope="scope">
          待注册用户数：{{ scope.row.unregistered_user }}
          <br>
          未审核人数：{{ scope.row.unauthorized_user }}
          <br>
          已授权用户数：{{ scope.row.authorized_user }}
          <br>
          复参次数：{{ scope.row.participation_time }}
        </template>
      </el-table-column>
      <el-table-column slot="four" show-overflow-tooltip align="left">
        <template slot-scope="scope">
          待收款金额：{{ scope.row.invoice_amount }}
          <br>
          上一次清算日期：{{ scope.row.last_award_date }}
          <br>
          国家：{{ scope.row.country }}
        </template>
      </el-table-column>
      <el-table-column slot="operation" type="expand" min-width="50px">
        <template slot-scope="scope">
          <supplierUser :data="scope.row.list" />
        </template>
      </el-table-column>
    </iTable>
  </div>
</template>

<script>
import { supplierStat } from '@/api/marketDetail'
import iTable from '@/components/Table'
import supplierUser from '../dialogTable/supplierUser'
import { setTimeout } from 'timers'

export default {
  components: {
    iTable,
    supplierUser
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
      oldList: [],
      configs: [
        { slot: 'operation' },
        { slot: 'one' },
        { slot: 'two' },
        { slot: 'three' },
        { slot: 'four' }
      ],
      market_code: '',
      listQuery: {
        market_code: '',
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    height() {
      return document.body.clientHeight - 350 + (this.status ? 0 : 120)
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'supplier') {
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
    handleChange(row) {
      this.$refs.supplierTable.$children[0].toggleRowExpansion(row)
      if (this.list[0].id === row.id && this.list.length === 1) {
        this.list = this.oldList
        const arr = Array.from(document.getElementsByClassName('table-select'))
        setTimeout(() => {
          arr[0].scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          })
        }, 500)
      } else {
        this.list = [row]
      }
    },
    fetchData() {
      this.listQuery.market_code = this.value.name
      supplierStat(this.listQuery, '.supplier').then(res => {
        this.list = res.data
        this.oldList = [...res.data]
        this.total = res.data.length
      })
    }
  }
}
</script>
<style scoped>
.supplier >>> .el-table {
  padding: 0 !important;
}
.supplier >>> .el-table__expanded-cell {
  padding: 10px !important;
  background-color: #d4d4d4;
}
.plasuppliern >>> .el-table__expanded-cell:hover > td,.supplier >>> .el-table__expanded-cell:hover{
  background-color: #d4d4d4!important;
}
</style>


<template>
  <div class="app-container">
    <el-card v-if="filterStatus" class="box-card ">
      <div slot="header" class="clearfix header">
        <i class="el-icon-search" />
        <span>搜索</span>
      </div>
      <div class="filter-container">
        <el-input v-model.trim="listQuery.name" size="small" style="width: 200px;" clearable class="filter-item" placeholder="请输入市场名称" @clear="handleFilter" />
        <el-date-picker
          v-model="time"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          unlink-panels
          end-placeholder="结束日期"
          class="filter-item"
          size="small"
        />
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter" />
      </div>
    </el-card>
    <el-card class="box-card margin-card">
      <div slot="header" class="clearfix header btnHeader">
        <svg-icon icon-class="list" />
        <span>付款详情</span>
        <el-button-group style="float:right;">
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="getSec" />
          <el-button class="filter-item " size="mini" type="success" icon="el-icon-refresh" @click="handleRefresh" />
        </el-button-group>
      </div>
      <iTable
        :data="list"
        :col-configs="configs"
        :max-height="height"
        :height="height"
        class="PayDetail"
        row-key="id"
      >
        <el-table-column slot="progress" show-overflow-tooltip label="付款进度" min-width="100px" align="center">
          <template slot-scope="scope">
            {{ scope.row.paied_invoice }} / {{ scope.row.all_inivoice }}
          </template>
        </el-table-column>
        <el-table-column slot="operation" show-overflow-tooltip label="付款详情" min-width="100px">
          <template slot-scope="scope">
            <el-button v-permission="['market:clearing:pay:show']" type="primary" size="mini" @click="handleDetail(scope.row)">发票明细</el-button>
          </template>
        </el-table-column>
      </iTable>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
    </el-card>
    <el-dialog :modal="false" :visible.sync="dialogFormVisible" title="应付发票详情" width="950px" top="50px" custom-class="dialogFull">
      <invoiceDetail :id="id" ref="dataForm" />
    </el-dialog>
  </div>
</template>

<script>
import { pay_monitor } from '@/api/marketClearing'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import invoiceDetail from './invoiceDetail'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'PayMonitor',
  directives: { elDragDialog },
  components: {
    iTable,
    Pagination,
    invoiceDetail
  },
  data() {
    return {
      height: document.body.clientHeight - 34 - 307 - 62 + 75,
      filterStatus: true,
      list: [],
      id: '',
      dialogFormVisible: false,
      configs: [
        { slot: 'operation' },
        { prop: 'paydate', label: '早付日期', minWidth: '100px' },
        { prop: 'market_name', label: '市场名称', minWidth: '180px' },
        { prop: 'contact_name', label: '市场负责人', minWidth: '100px' },
        { prop: 'company_name', label: '所属公司', minWidth: '150px' },
        { prop: 'group_name', label: '所属集团', minWidth: '120px' },
        { prop: 'clear_amount', label: '付款金额', numFormat: true, minWidth: '130px' },
        { prop: 'clear_discount', label: '折扣金额', numFormat: true, minWidth: '100px' },
        { slot: 'progress' },
        // { prop: 'invoice_amount', label: '发票金额', numFormat: true, minWidth: '100px' },
        { prop: 'saller', label: '所属销售', minWidth: '100px' }
      ],
      total: 0,
      time: '',
      listQuery: {
        page: 1,
        size: 10,
        name: '',
        start_time: '',
        end_time: ''
      }
    }
  },
  watch: {
    time(val) {
      if (val) {
        this.listQuery.start_time = val[0]
        this.listQuery.end_time = val[1]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getSec() {
      this.filterStatus = !this.filterStatus
      this.filterStatus ? this.height = document.body.clientHeight - 34 - 307 - 62 + 75 : this.height = document.body.clientHeight - 34 - 307 - 62 + 75 + 93
    },
    handleDetail(row) {
      this.dialogFormVisible = true
      this.id = row.history_id
    },
    handleRefresh() {
      this.listQuery = {
        page: 1,
        size: 10,
        name: '',
        start_time: '',
        end_time: ''
      }
      this.time = []
      this.fetchData()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    fetchData() {
      pay_monitor(this.listQuery, '.PayDetail').then(res => {
        this.list = res.data.list
        this.total = res.data.data_count
      })
    }
  }
}
</script>
<style>
.dialogFull {
  margin-right: 0;
  height: calc(100% - 50px);
}
</style>
<style scoped>
.btnHeader{
  line-height: 28px;
}
.filter-container{
  margin-bottom: 0;
  padding: 0;
}
.margin-card{
  margin-top: 10px;
}
.margin-card>>>.el-card__body{
  padding: 0;
}
.box-card>>>.el-card__body{
  padding: 10px 10px 0;
}

</style>


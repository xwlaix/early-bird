<template>
  <div class="app-container">
    <el-card v-if="filterStatus" class="box-card">
      <div slot="header" class="clearfix header">
        <i class="el-icon-search" />
        <span>搜索</span>
      </div>
      <div class="filter-container">
        <el-input v-model.trim="listQuery.name" size="small" style="width:200px" clearable class="filter-item" placeholder="请输入买家名称" @clear="handleFilter" />
        <el-date-picker v-model="listQuery.time" size="small" value-format="yyyy-MM" type="month" placeholder="请选择月份" class="filter-item" />
        <el-select v-model="listQuery.area" size="small" class="filter-item" filterable clearable placeholder="请选择商洽片区" style="width:200px">
          <el-option v-for="item in areaList" :key="item.name" :value="item.name" />
        </el-select>
        <el-select v-model="listQuery.market" class="filter-item" size="small" filterable clearable placeholder="请选择市场" style="width:200px;">
          <el-option v-for="item in marketList" :key="item.code" :value="item.code" :label="item.name" />
        </el-select>
        <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter" />
      </div>
    </el-card>
    <el-card class="box-card margin-card">
      <div slot="header" class="clearfix header btnHeader">
        <svg-icon icon-class="list" />
        <span>服务费用详情</span>
        <el-button-group style="float:right">
          <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="getSec" />
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-refresh" @click="handleRefresh" />
        </el-button-group>
      </div>
      <iTable :data="list" :col-configs="configs" :max-height="height" :height="height" class="finance" row-key="id">
        <el-table-column slot="operation" show-overflow-tooltip label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleDownload(scope.row)">导出</el-button>
          </template>
        </el-table-column>
      </iTable>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
    </el-card>
  </div>
</template>

<script>
import { pay_monitor } from '@/api/marketClearing'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination'

export default {
  name: 'Finance',
  components: {
    iTable, Pagination
  },
  props: {},
  data() {
    return {
      areaList: [{
        name: '大陆'
      }, {
        name: '香港'
      }
      ],
      marketList: [
        {
          name: '市场二',
          code: '2'
        }, {
          name: '市场一',
          code: '1'
        }
      ],
      filterStatus: true,
      height: document.body.clientHeight - 34 - 307 - 62 + 75,
      list: [],
      total: 0,
      configs: [
        { slot: 'operation' },
        { props: 'paydate', label: '日期' },
        { props: 'market_name', label: '市场名称' },
        { props: 'contact_name', label: '买家' },
        { props: 'group_name', label: '商洽片区' },
        { prop: 'clear_amount', label: '自然年总金额', numFormat: true, minWidth: '130px' },
        { prop: 'clear_amount', label: '佣金率', minWidth: '130px' },
        { prop: 'clear_amount', label: '本月清算总金额', numFormat: true, minWidth: '130px' },
        { prop: 'clear_amount', label: '清算收益', numFormat: true, minWidth: '130px' },
        { prop: 'clear_amount', label: '佣金金额', numFormat: true, minWidth: '130px' }
      ],
      listQuery: {
        name: '',
        time: '',
        area: '',
        market: '',
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {},
  methods: {
    getSec() {
      this.filterStatus = !this.filterStatus
      this.filterStatus ? this.height = document.body.clientHeight - 34 - 307 - 62 + 75 : this.height = document.body.clientHeight - 34 - 307 - 62 + 75 + 93
    },
    handleDownload() {
      this.$confirm(
        '此操作做将导出该条服务费率详情，是否继续？',
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        console.log('确认导出')
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleRefresh() {
      this.listQuery = {
        name: '',
        time: '',
        area: '',
        market: '',
        page: 1,
        size: 10
      }
      this.fetchData()
    },
    fetchData() {
      pay_monitor(this.listQuery, '.finance').then(res => {
        this.list = res.data.list
        this.total = res.data.data_count
      })
    }

  }
}
</script>

<style  scoped>
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

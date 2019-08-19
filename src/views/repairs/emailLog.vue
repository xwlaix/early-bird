<template>
  <div class="app-container">
    <div v-if="filterStatus" class="filter-container">
      <el-input v-model.trim="listQuery.title" size="small" filterable style="width: 200px;" clearable class="filter-item" placeholder="请输入邮件模板标题" @clear="handleFilter" />
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
      <el-select v-model="listQuery.language" size="small" clearable class="filter-item" placeholder="请选择邮件模板语言" @change="handleFilter">
        <el-option
          v-for="item in languageArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter" />
    </div>
    <div class="table-container group_container" style="text-align:right;">
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="getSec" />
      <el-button class="filter-item " size="small" type="success" icon="el-icon-refresh" @click="handleRefresh" />
    </div>
    <iTable
      :data="list"
      :col-configs="configs"
      :max-height="height"
      :height="height"
      class="emailLog"
      row-key="id"
    >
      <el-table-column slot="operation" show-overflow-tooltip label="发送内容" min-width="100px" align="center">
        <template slot-scope="scope">
          <svg-icon v-permission="['email:log:detail']" icon-class="more" style="font-size:24px;color:#409EFF;margin-top:4px;" @click="handleChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column slot="status" show-overflow-tooltip label="状态" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status==0?'失败':'成功' }}</span>
        </template>
      </el-table-column>
    </iTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
    <el-dialog :visible.sync="dialogFormVisible" custom-class="custom-class" top="5vh" width="650px">
      <div slot="title" class="dialog-footer" />
      <div class="hr" />
      <div v-html="temp.content" />
    </el-dialog>
  </div>
</template>

<script>
import { listLogs, getlog } from '@/api/email'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'EmailLog',
  components: {
    iTable,
    Pagination
  },
  data() {
    return {
      height: document.body.clientHeight - 34 - 273,
      filterStatus: true,
      list: [],
      configs: [
        { slot: 'operation' },
        { prop: 'id', label: '编号ID', minWidth: '60px' },
        { prop: 'template_code', label: '模板编码', minWidth: '80px' },
        { prop: 'from_email', label: '发送的邮箱', minWidth: '160px' },
        { prop: 'to_email', label: '接受的邮箱', minWidth: '160px' },
        { prop: 'subject', label: '邮件主题', minWidth: '160px' },
        { prop: 'createtime', label: '创建时间', minWidth: '140px' },
        { slot: 'status' }
      ],
      dialogFormVisible: false,
      total: 0,
      time: '',
      listQuery: {
        page: 1,
        size: 10,
        title: '',
        start_time: '',
        end_time: '',
        language: ''
      },
      languageArr: [
        {
          value: 'english',
          label: '英文'
        }, {
          value: 'chinese',
          label: '中文'
        }
      ],
      temp: {

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
      this.filterStatus ? this.height = document.body.clientHeight - 34 - 273 : this.height = document.body.clientHeight - 34 - 180
    },
    handleRefresh() {
      this.listQuery = {
        page: 1,
        size: 10,
        title: '',
        start_time: '',
        end_time: '',
        language: ''
      }
      this.time = []
      this.fetchData()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleChange(row) {
      getlog(row.id, '.emailLog').then((res) => {
        this.temp = Object.assign(this.temp, res.data) // copy obj
        this.dialogFormVisible = true
      })
    },
    fetchData() {
      listLogs(this.listQuery, '.emailLog').then(res => {
        this.list = res.data.list
        this.total = res.data.data_count
      })
    }
  }
}
</script>
<style scoped>
.app-container>>>.el-card__body{
  height: calc(100vh - 34px - 147px);
}
.hr{
  height: 1px;
  width: 100%;
  background: #ddd;
  margin-bottom: 22px;
}

.app-container>>>.el-dialog__body ,.app-container>>>.el-dialog__header{
  padding: 0!important;
}
.app-container>>>.el-dialog__wrapper{
  overflow: hidden;
}
</style>

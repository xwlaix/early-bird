<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.user_role" size="small" class="filter-item" filterable clearable placeholder="请选择角色" style="width:200px">
        <el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
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
      <el-button class="filter-item " size="small" type="success" icon="el-icon-refresh" @click="handleRefresh" />
    </div>
    <iTable
      :data="list"
      :col-configs="configs"
      :height="height"
      :max-height="height"
      class="emailLog"
      row-key="id"
    >
      <el-table-column slot="path" show-overflow-tooltip label="反馈网址" min-width="160px" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            {{ scope.row.app_host }}
            <div slot="reference">
              <el-tag size="medium"> {{ scope.row.app_host | getText }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column slot="content" show-overflow-tooltip label="反馈内容" min-width="160px" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            {{ scope.row.feedback }}
            <div slot="reference">
              <el-tag size="medium">{{ scope.row.feedback | getText }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column slot="images" label="查看图片" show-overflow-tooltip align="center" min-width="170">
        <template slot-scope="scope">
          <el-button v-permission="['setting:user:update']" type="primary" size="mini" @click="handleUpdate(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </iTable>

    <el-dialog v-el-drag-dialog :visible.sync="dialogFormVisible" title="图片列表">
      <el-image v-for="(item,index) in image" :key="index" :src="item" class="imgae" width="100%" alt="" />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="updateData">取消</el-button>
        <el-button type="primary" size="small" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { feedback } from '@/api/apiLog'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'Problem',
  directives: { elDragDialog },

  components: {
    iTable,
    Pagination
  },
  filters: {
    getText(row) {
      return row.length > 35 ? row.substring(0, 35) + '...' : row
    }
  },
  data() {
    return {
      height: document.body.clientHeight - 257,
      list: [],
      configs: [
        { slot: 'images' },
        { prop: 'user_name', label: '用户账号', minWidth: '180px' },
        // { prop: 'user_name', label: '角色', minWidth: '140px' },
        { prop: 'phone', label: '联系方式', minWidth: '120px' },
        { prop: 'create_time', label: '反馈时间', minWidth: '120px' },
        { slot: 'path' },
        { slot: 'content' }
      ],
      image: [],
      role: [{
        id: 'buyer',
        name: '买家市场负责人'
      }, {
        id: 'vendor',
        name: '供应商市场负责人'
      }],
      total: 0,
      dialogFormVisible: false,
      time: '',
      listQuery: {
        page: 1,
        size: 10,
        user_role: '',
        start_time: '',
        end_time: ''
      },
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
    handleUpdate(row) {
      this.image = JSON.parse(row.image)
      this.dialogFormVisible = true
    },
    updateData() {
      this.image = []
      this.dialogFormVisible = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleRefresh() {
      this.listQuery = {
        page: 1,
        size: 10,
        user_role: '',
        start_time: '',
        end_time: ''
      }
      this.time = []
      this.fetchData()
    },
    fetchData() {
      feedback(this.listQuery, '.emailLog').then(res => {
        this.list = res.data.list
        this.total = res.data.data_count
      })
    }
  }
}
</script>
<style scoped>
.imgae {
  display: inline-block;
  padding: 10px;
}
</style>

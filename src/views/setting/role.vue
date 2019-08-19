<template>
  <div class="app-container calendar-list-container">
    <div v-if="filterStatus" class="filter-container">
      <el-input v-model.trim="listQuery.title" size="small" style="width: 200px;" clearable class="filter-item" placeholder="请输入角色名称" @clear="handleFilter" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter" />
    </div>
    <div class="table-container">
      <el-button v-permission="['setting:role:add']" class="filter-item left" icon="el-icon-plus" size="small" type="primary" @click="handleCreate">添加</el-button>
      <el-button-group class="right">
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="getSec" />
        <el-button v-waves class="filter-item " size="small" type="success" icon="el-icon-refresh" @click="handleRefresh" />
      </el-button-group>
    </div>
    <el-table
      :key="tableKey"
      :max-height="height"
      :height="height"
      :header-cell-style="{background:'rgb(240,247,255)',color:'#606266'}"
      :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)"
      style="margin:0 auto;padding:0 10px;"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      highlight-current-row
    >
      <el-table-column show-overflow-tooltip align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="角色名称" min-width="190">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="备注" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" show-overflow-tooltip align="center" min-width="200">
        <template slot-scope="scope">
          <el-button v-permission="['setting:role:update']" icon="el-icon-edit" type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-permission="['setting:role:handle']" :type="scope.row.status==1?'danger':'success'" size="mini" @click="handleDelete(scope.row)">{{ scope.row.status==1?'禁用':'启用' }}</el-button>
        </template>

      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" class="dialog" label-position="right" label-width="6rem">
        <el-form-item label="名称" prop="title">
          <el-input v-model.trim="temp.title" clearable placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model.trim="temp.remark" clearable />
        </el-form-item>
        <el-form-item label="菜单过滤器" prop="menu">
          <el-input
            v-model="filterText"
            clearable
            placeholder="输入关键字进行过滤"
          />
          <el-tree
            ref="tree"
            :data="menu"
            :default-checked-keys="checkedKeys"
            :filter-node-method="filterNode"
            style="margin-top:10px;"
            class="menu"
            show-checkbox
            highlight-current
            node-key="id"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" size="small" @click="createData">确定</el-button>
        <el-button v-else type="primary" size="small" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { groups, menus, groupsCreate, groupsUpdate, groupsEnables } from '@/api/stageuser'
import { toTreeData } from '@/utils/tree'
import waves from '@/directive/waves' // 水波纹指令
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'SettingRole',
  components: { Pagination },
  directives: {
    waves, elDragDialog
  },
  data() {
    const validateTitle = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入请输入名称'))
      } else if (!(/^[\u4e00-\u9fa5_a-zA-Z]+$/).test(value)) {
        callback(new Error('角色名称只允许字母和汉字!'))
      } else {
        callback()
      }
    }
    return {
      height: document.body.clientHeight - 34 - 273,
      filterStatus: true,
      filterText: '',
      tableKey: 0,
      list: [],
      total: 0,
      menu: [],
      checkedKeys: [],
      listQuery: {
        page: 1,
        size: 10,
        title: ''
      },
      temp: {
        id: undefined,
        title: '',
        enname: '',
        type: '',
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改【角色】',
        create: '添加【角色】'
      },
      rules: {
        title: [
          {
            required: true,
            trigger: 'blur',
            validator: validateTitle
          }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    dialogFormVisible(val) {
      if (!val) {
        this.filterText = ''
      }
    }
  },
  created() {
    this.getList()
    this.getMenu()
  },
  methods: {
    getSec() {
      this.filterStatus = !this.filterStatus
      this.filterStatus ? this.height = document.body.clientHeight - 34 - 273 : this.height = document.body.clientHeight - 34 - 180
    },
    getMenu() {
      menus().then(res => {
        this.menu = toTreeData(res.data)
      })
    },
    handleRefresh() {
      this.listQuery = {
        page: 1,
        size: 10,
        title: ''
      }
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        remark: ''
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.tree.setCheckedKeys([])
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          groupsCreate({
            title: tempData.title,
            menu_id: this.$refs.tree.getCheckedKeys().join(','),
            remark: tempData.remark
          }, '.el-dialog__footer')
            .then(res => {
              if (res.code === 200) {
                this.getList()
                this.dialogFormVisible = false
              }
              this.$notify({
                title: '结果',
                message: res.msg,
                duration: 2000,
                type: +res.code === 200 ? 'success' : 'error'
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(row.menu_id.split(','))
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          groupsUpdate({
            id: tempData.id,
            title: tempData.title,
            menu_id: this.$refs.tree.getCheckedKeys().join(','),
            remark: tempData.remark
          }, '.el-dialog__footer').then(res => {
            if (res.code === 200) {
              this.getList()
              this.dialogFormVisible = false
            }
            this.$notify({
              title: '结果',
              message: res.msg,
              duration: 2000,
              type: +res.code === 200 ? 'success' : 'error'
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm(
        `此操作将${row.status === 0 ? '启用' : '禁用'}该角色, 是否继续?`,
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          groupsEnables({
            ids: row.id, status: row.status === 0 ? 1 : 0
          }, '.el-message-box').then(res => {
            if (+res.code === 200) {
              this.getList()
            }
            this.$notify({
              title: '结果',
              message: res.msg,
              duration: 2000,
              type: +res.code === 200 ? 'success' : 'error'
            })
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消',
            duration: 2000
          })
        })
    },
    getList() {
      groups(this.listQuery, '.table').then(res => {
        this.list = res.data || []
        this.total = res.data.length || 0
      })
    }
  }
}
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0;
}

.icon-star {
  margin-right: 2px;
}

.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.show-d {
  margin-top: 15px;
}
</style>

<template>
  <div class="app-container calendar-list-container">
    <div v-if="filterStatus" class="filter-container">
      <el-input v-model.trim="listQuery.keywords" size="small" style="width: 200px;" clearable class="filter-item" placeholder="请输入搜索关键词" @clear="handleRefresh" />
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter" />
      <!-- <el-button v-permission="['setting:menu:show']" class="filter-item" size="small" type="success" @click="jumpMenu">权限菜单</el-button> -->
      <!-- <el-button v-permission="['setting:role:show']" class="filter-item" size="small" type="success" @click="jumpRole">角色管理</el-button> -->
    </div>
    <div class="table-container">
      <el-button v-permission="['setting:user:add']" class="filter-item left" icon="el-icon-plus" size="small" type="primary" @click="handleCreate">添加</el-button>
      <el-button-group class="right">
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="getSec" />
        <el-button v-waves class="filter-item " size="small" type="success" icon="el-icon-refresh" @click="handleRefresh" />
      </el-button-group>
    </div>
    <!-- Note that row-key is necessary to get a correct row order. -->
    <el-table
      :key="tableKey"
      :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)"
      :max-height="height"
      :height="height"
      :header-cell-style="{background:'rgb(240,247,255)',color:'#606266'}"
      style="margin:0 auto;padding:0 10px;"
      row-key="id"
      element-loading-text="给我一点时间"
      size="mini"
      class="table"
      highlight-current-row
    >
      <el-table-column show-overflow-tooltip align="center" label="ID" min-width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="帐号" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="真实姓名" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="内部邮箱" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="备注" min-width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip align="center" label="创建时间" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time*1000 | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="所属部门" min-width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.s_name }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="所在岗位" min-width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.p_name }}
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip align="center" min-width="170">
        <template slot-scope="scope">
          <el-button v-permission="['setting:user:update']" icon="el-icon-edit" type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-permission="['setting:user:handle']" :type="scope.row.status==1?'danger':'success'" size="mini" @click="handleDelete(scope.row)">{{ scope.row.status==1?'禁用':'启用' }}</el-button>
        </template>

      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="6rem">
        <el-form-item label="登陆账号" prop="username">
          <el-input v-model.trim="temp.username" clearable placeholder="请输入登陆账号" style="width:200px" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="temp.password" clearable placeholder="请输入密码" style="width:200px" />
        </el-form-item>
        <el-form-item label="用户备注" prop="remark">
          <el-input v-model.trim="temp.remark" clearable style="width:200px" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model.trim="temp.realname" clearable style="width:200px" />
        </el-form-item>
        <el-form-item label="内部邮箱" prop="email">
          <el-input v-model.trim="temp.email" clearable style="width:200px" />
        </el-form-item>
        <el-form-item label="所属部门" prop="structure_id">
          <el-select v-model="temp.structure_id" class="filter-item" filterable clearable placeholder="请选择所属部门" style="width:200px">
            <el-option v-for="item in selectTemp.structure_id" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所在岗位" prop="post_id">
          <el-select v-model="temp.post_id" class="filter-item" filterable clearable placeholder="请选择所在岗位" style="width:200px">
            <el-option v-for="item in selectTemp.post_id" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="groups">
          <el-select v-model="temp.groups" class="filter-item" multiple collapse-tags clearable placeholder="请选择角色" style="width:200px">
            <el-option v-for="item in roleSelect" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
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
import { usersList, usersSave, usersUpdate, usersEnables, groups, posts, structures } from '@/api/stageuser'
import waves from '@/directive/waves' // 水波纹指令
import Pagination from '@/components/Pagination'
import { isTransferred, isEmail } from '@/utils/validate'
import moment from 'moment'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'SettingJurisdiction',
  components: { Pagination },
  directives: {
    waves, elDragDialog
  },
  filters: {
    timeFilter(create_time) {
      return moment(create_time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    var validateReal = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入真实姓名'))
      } else if ((/[0-9]/).test(value)) {
        callback(new Error('真实姓名不能含有数字!'))
      } else {
        callback()
      }
    }
    var validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入登陆账号'))
      } else if (isTransferred(value)) {
        callback(new Error('登陆账号含有转义字符!'))
      } else if (!/^\w+$/.test(value)) {
        callback(new Error('登陆账号仅允许字母数字下划线!'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入内部邮箱'))
      } else if (!isEmail(value)) {
        callback(new Error('内部邮箱填写不正确'))
      } else {
        callback()
      }
    }
    return {
      height: document.body.clientHeight - 34 - 273,
      filterStatus: true,
      tableKey: 0,
      list: [],
      total: 0,
      roleSelect: [],
      listQuery: {
        page: 1,
        size: 10,
        keywords: ''
      },
      selectTemp: {
        structure_id: [],
        post_id: []
      },
      temp: {
        id: undefined,
        groups: [],
        username: '',
        password: '',
        remark: '',
        realname: '',
        structure_id: '',
        post_id: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改【用户】',
        create: '添加【用户】',
        // menu: '权限',
        updateRole: '角色',
        password: '密码'
      },
      rules: {
        realname: [
          {
            required: true,
            trigger: 'blur',
            validator: validateReal
          }
        ],
        groups: [
          {
            required: true,
            message: '角色不能为空',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUser
          }
        ],
        email: [
          {
            required: true,
            trigger: 'blur',
            validator: validateEmail
          }
        ]
      }
    }
  },
  created() {
    this.getSelect()
    this.getList()
  },
  methods: {
    getSec() {
      this.filterStatus = !this.filterStatus
      this.filterStatus ? this.height = document.body.clientHeight - 34 - 273 : this.height = document.body.clientHeight - 34 - 180
    },
    getSelect() {
      groups('', '').then(res => {
        this.roleSelect = res.data
      })
      posts().then(res => {
        this.selectTemp.post_id = res.data
      })
      structures().then(res => {
        this.selectTemp.structure_id = res.data
      })
    },
    jumpMenu() {
      this.$router.push('/setting/menu')
    },
    jumpRole() {
      this.$router.push('/setting/role')
    },
    handleRefresh() {
      this.listQuery = {
        page: 1,
        size: 10,
        keywords: ''
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
        groups: [],
        username: '',
        password: '',
        realname: '',
        email: '',
        structure_id: '',
        post_id: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.temp.password.length < 5 || this.temp.password.length > 13) {
            this.$notify({
              title: '注意',
              message: '密码长度应为6至12位！',
              duration: 2000,
              type: 'error'
            })
            return false
          }
          if (isTransferred(this.temp.password)) {
            this.$notify({
              title: '注意',
              message: '密码中不能含有转义字符！',
              duration: 2000,
              type: 'error'
            })
            return false
          }
          usersSave(this.temp, '.el-dialog__footer')
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
      this.temp = Object.assign({}, {
        id: row.id,
        username: row.username,
        email: row.email,
        realname: row.realname,
        structure_id: row.structure_id,
        post_id: row.post_id,
        groups: row.group_ids,
        remark: row.remark
      }) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          usersUpdate(tempData, '.el-dialog__footer').then(res => {
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
        `此操作将${row.status === 0 ? '启用' : '禁用'}该账号, 是否继续?`,
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          usersEnables({
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
      usersList(this.listQuery, '.table').then(res => {
        this.list = res.data.list || []
        this.total = res.data.dataCount || 0
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

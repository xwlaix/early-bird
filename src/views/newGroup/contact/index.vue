<template>
  <div>
    <div class="table-container">
      <el-button v-permission="['group:contact:company:add','group:step']" size="small" type="primary" class="filter-item" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button-group class="right">
        <el-button class="filter-item " size="small" type="success" icon="el-icon-refresh" @click="handleRefresh" />
      </el-button-group>
    </div>
    <el-table
      :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)"
      :max-height="height"
      :height="height"
      :header-cell-style="{background:'rgb(240,247,255)',color:'#606266'}"
      style="width: calc(100% - 20px);margin:0 auto;"
      row-key="id"
      element-loading-text="Loading"
      size="mini"
      class="table"
      column-key="actions"
      fit
      highlight-current-row
    >
      <!-- <el-table-column show-overflow-tooltip align="center" label="公司编码" min-width="130">
        <template slot-scope="scope">
          {{ scope.row.group_code }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="联系人编码" min-width="130">
        <template slot-scope="scope">
          {{ scope.row.contact_code }}
        </template>
      </el-table-column> -->
      <el-table-column show-overflow-tooltip align="center" label="联系人" min-width="80">
        <template slot-scope="scope">
          {{ scope.row.user_name }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="用户职位" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.user_position }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="联系电话" min-width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.user_phone }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="用户邮箱" min-width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.user_email }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="企业负责人" min-width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.is_enterprise=='1'?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="财务负责人" min-width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.is_financial=='1'?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="平台授权登录" min-width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.is_login_permission=='1'?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column label="负责市场" min-width="170" align="center">
        <template slot-scope="scope">
          <el-tooltip :content="getAllmarket(scope.row)" class="item" effect="dark" placement="top">
            <span>{{ scope.row.authorized_market_name| get_market_name }} </span>
          </el-tooltip>

        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="用户状态" min-width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row | getStatus }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="left" show-overflow-tooltip min-width="180px">
        <template slot-scope="scope">
          <el-button v-permission="['group:list:contact:update','group:step']" type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-permission="['group:list:contact:handle','group:step']" :type="getType(scope.row)" :disabled="scope.row.is_login_permission!=1" :loading="scope.row.loading" size="mini" @click="handleDelete(scope.row,scope)">
            {{ getBtn(scope.row) }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body>
      <ContactForm ref="dataForm" :temp="temp" :is-activated="is_activated" />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.size"
        :pager-count="5"
        :total="total"
        background
        layout="total, sizes,jumper, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { contactList, getContactData, createContact, updateContact, deleteContact, activateContact } from '@/api/contact'
import ContactForm from './form'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  components: { ContactForm },
  filters: {
    getStatus(row) {
      const active = { 0: '未注册', 1: '待激活', 2: '已激活' }
      if (row.status) {
        return active[row.is_activated]
      } else {
        return '已禁用'
      }
    },
    get_market_name(row) {
      if (Array.from(row).length > 0 && row !== '--') {
        return `【${row[0]}】${row.length > 1 ? '...' : ''}`
      } else {
        return '暂无'
      }
    }
  },
  props: {
    source: {
      type: String,
      default: ''
    },
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
      height: '',
      filterStatus: true,
      code: '',
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      },
      loading: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改【联系人】',
        create: '添加【联系人】'
      },
      is_activated: '',
      f_user_role: [],
      temp: {}
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'contact' || val.active === 0) {
          this.code = this.value.code
        }
      }
    },
    code() {
      this.fetchData()
    },
    status() {
      if (!this.status) {
        this.height = document.body.clientHeight - 425 + 120
      } else {
        this.height = document.body.clientHeight - 425
      }
    }
  },
  created() {
    this.source === 'step'
      ? this.height = document.body.clientHeight - 34 - 385 + 15
      : this.height = document.body.clientHeight - 425 + 120
    if (this.status) {
      this.height = this.height - 120
    }
    this.code = this.code || this.value.code
  },
  methods: {
    getAllmarket(row) {
      if (row.authorized_market_name !== '--' && Array.from(row.authorized_market_name).length > 0) {
        const content = []
        for (const elem of Array.from(row.authorized_market_name).values()) {
          content.push(`【${elem}】`)
        }
        return content.join(',')
      } else {
        return '暂无'
      }
    },
    getBtn(row) {
      if (row.is_login_permission === 1) {
        return row.is_activated !== 2 ? '邀请' : row.status === 1 ? '禁用' : '启用'
      } else {
        return '邀请'
      }
    },
    getType(row) {
      if (row.is_login_permission === 1) {
        return row.is_activated !== 2 ? 'success' : row.status === 1 ? 'danger' : 'success'
      } else {
        return 'info'
      }
    },

    getData(code) {
      getContactData(code, '.table').then(res => {
        const tempObject = {}
        if (code) {
          Object.keys(res.data).forEach((key) => {
            tempObject['f_' + key] = res.data[key]
          })
          this.temp = Object.assign({}, tempObject)
          this.temp.f_code = this.temp.f_contact_code
          delete this.temp.f_contact_code
          delete this.temp.f_group_code
        }
      })
    },
    getRole() {
      this.f_user_role = []
      if (this.temp.f_is_enterprise) {
        this.f_user_role.push('enterprise')
      }
      if (this.temp.f_is_financial) {
        this.f_user_role.push('financial')
      }
      if (this.temp.f_is_login_permission) {
        this.f_user_role.push('login_permission')
      }
      this.temp.f_user_role = this.f_user_role
      delete this.temp.f_is_enterprise
      delete this.temp.f_is_financial
      delete this.temp.f_is_login_permission
    },
    getRoleValue() {
      if (this.f_user_role.includes('enterprise')) {
        this.temp.f_is_enterprise = 1
      } else {
        this.temp.f_is_enterprise = 0
      }
      if (this.f_user_role.includes('financial')) {
        this.temp.f_is_financial = 1
      } else {
        this.temp.f_is_financial = 0
      }
      if (this.f_user_role.includes('login_permission')) {
        this.temp.f_is_login_permission = 1
      } else {
        this.temp.f_is_login_permission = 0
      }
    },
    resetTemp() {
      this.f_user_role = []
      this.temp = {
        f_last_name: '',
        f_is_enterprise: 0,
        f_is_financial: 0,
        f_is_login_permission: 0,
        f_first_name: '',
        f_user_position: '',
        f_user_phone: '',
        f_user_email: '',
        f_group_code: '',
        f_user_role: []
      }
      this.is_activated = ''
    },
    handleUpdate(row) {
      this.getData(row.contact_code)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.is_activated = row.is_activated.toString()
      this.$nextTick(() => {
        this.$refs['dataForm'].$children[0].clearValidate()
      })
    },
    handleAdd() {
      if (!this.code) {
        this.$notify({
          title: '失败',
          message: '请先选择集团',
          duration: 2000,
          type: 'error'
        })
        return false
      }
      this.resetTemp()
      this.temp.f_group_code = this.code
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].$children[0].clearValidate()
      })
    },
    handleDelete(row, scope) {
      let text = ''
      if (row.is_login_permission === 1) {
        text = row.is_activated === 1 || row.is_activated === 0 ? '邀请' : row.status === 0 ? '启用' : '禁用'
      } else {
        text = row.status === 0 ? '启用' : '禁用'
      }
      if (row.authorized_market_name.length > 0 && text === '禁用') {
        this.$notify({
          title: '失败',
          message: `该联系人已经负责${row.authorized_market_name.join(',')}`,
          duration: 2000,
          type: 'error'
        })
        return false
      }
      this.list.splice(scope.$index, 1, Object.assign(row, { loading: true }))
      this.$confirm(
        `此操作将${text}该联系人, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          (
            row.is_activated === 1 || row.is_activated === 0 ? (
              activateContact({ f_code: row.contact_code }, '.el-dialog__footer')
            ) : (
              deleteContact({ f_code: row.contact_code,
                f_status: row.status === 0 ? 1 : 0 }, '.el-dialog__footer')
            )
          ).then((res) => {
            this.list.splice(scope.$index, 1, Object.assign(row, { loading: false }))
            this.$notify({
              title: '成功',
              message: res.msg,
              duration: 2000,
              type: 'success'
            })
            this.fetchData()
          }).catch(() => {
            this.list.splice(scope.$index, 1, Object.assign(row, { loading: false }))
          })
        })
        .catch(() => {
          this.list.splice(scope.$index, 1, Object.assign(row, { loading: false }))
          this.$notify({
            type: 'info',
            message: '已取消',
            duration: 2000
          })
        })
    },
    updateData() {
      this.$refs['dataForm'].$children[0].validate(valid => {
        if (valid) {
          this.getRole()
          const tempData = Object.assign({}, this.temp)
          if (this.dialogStatus === 'create') {
            createContact(tempData, '.el-dialog__footer').then((res) => {
              this.fetchData()
              this.dialogFormVisible = false
            }).catch(() => {
              this.getRoleValue()
            })
          }
          if (this.dialogStatus === 'update') {
            updateContact(tempData, '.el-dialog__footer').then((res) => {
              this.fetchData()
              this.dialogFormVisible = false
            }).catch(() => {
              this.getRoleValue()
            })
          }
        }
      })
    },
    handleRefresh() {
      this.listQuery = {
        page: 1,
        size: 10
      }
      this.fetchData()
    },
    handleSizeChange(val) {
      this.listQuery.size = val
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
    },
    fetchData() {
      if (this.code) {
        const code = this.code
        contactList(code, '.table').then(res => {
          this.list = res.data.list
          this.total = res.data.data_count
          if (this.total === 0) {
            this.$notify({
              type: 'info',
              message: '搜索不到相关的联系人，请添加联系人信息!',
              duration: 2000
            })
          }
          try {
            this.$parent.getTotal('contact', this.total)
          } catch (error) {
            console.log(error)
          }
        })
      }
    }
  }
}
</script>


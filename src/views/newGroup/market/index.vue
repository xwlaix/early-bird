<template>
  <div>
    <div class="table-container market_container">
      <el-button v-permission="['group:step','group:list:market:add']" size="small" type="primary" class="filter-item" icon="el-icon-plus" @click="handleAdd">添加</el-button>
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
      class="market_table"
      column-key="actions"
      fit
      highlight-current-row
    >
      <el-table-column show-overflow-tooltip align="center" label="公司名称" min-width="140">
        <template slot-scope="scope">
          {{ scope.row.company_name }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="市场名称" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.market_name }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="币种名称/币种符号" min-width="135" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.currency_name }} / {{ scope.row.currency_sign }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市场负责人" min-width="105" align="center">
        <template slot-scope="scope">
          <el-tooltip :content="getAllmarket(scope.row)" class="item" effect="dark" placement="top">
            <span>{{ scope.row.market_authorized_user| get_authorized }} </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="应付清算部门邮箱" min-width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.charge_user_name||'--' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="数据同步方式" min-width="90" align="center">
        <template slot-scope="scope">
          {{ scope.row.sync_type=='1'?'自动':'手动' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="市场状态" min-width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.is_deleted=='0'?'激活':'禁用' }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="left" show-overflow-tooltip min-width="240px">
        <template slot-scope="scope">

          <el-button v-permission="['group:step','group:list:market:update']" icon="el-icon-edit" type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-permission="['group:step','group:list:market:handle']" :type="scope.row.is_deleted==0?'danger':'success'" size="mini" @click="handleDelete(scope.row)">{{ scope.row.is_deleted==0?'禁用':'激活' }}</el-button>
          <el-button v-permission="['group:step','group:list:market:upload:supplier','group:list:market:upload:contact','group:list:market:upload:invoices']" type="primary" size="mini" @click="handleUpload(scope.row)">导入数据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body>
      <marketForm ref="dataForm" :temp="temp" :charge-list="charge_list" :contact-list="contact_list" :company-list="company_list" :dialog-status="dialogStatus" />
      <authorized :authorized-user="authorized_list" :market-authorized-user="temp.f_market_authorized_user" :charge-code="temp.f_charge_user_code" :dialog-visible="dialogFormVisible" @changeUser="changeUser" />
      <div slot="footer" class="dialog-footer marker_footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" title="导入数据" class="upload" append-to-body>
      <marketTabs :f-code="upload_code" />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="dialogVisible = false">确定</el-button>
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
import { getMarket, createMarket, updateMarket, deleteMarket } from '@/api/market'
import { contactList } from '@/api/contact'
import { showGroup } from '@/api/group'
import { getCompany } from '@/api/company'
import marketForm from './form'
import authorized from './authorized'
import marketTabs from './tabs'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  components: { marketForm, marketTabs, authorized },
  filters: {
    get_authorized(row) {
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
      upload_code: '',
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      },
      company_code: '',
      company_list: [],
      dialogVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改【市场】',
        create: '添加【市场】'
      },
      charge_list: [],
      contact_list: [],
      authorized_list: [],
      temp: {

      },
      rules: {

      }
    }
  },
  watch: {
    code() {
      this.getCompanyList()
      this.fetchData()
    },
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'market' || val.active === 4) {
          this.code = this.value.code
        }
      }
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
    this.code = this.$route.query.group_code || this.value.code
  },
  methods: {
    handleRefresh() {
      this.listQuery = {
        page: 1,
        size: 10
      }
      this.fetchData()
    },
    getAllmarket(row) {
      if (row.market_authorized_user !== '--' && Array.from(row.market_authorized_user).length > 0) {
        const content = []
        for (const elem of Array.from(row.market_authorized_user).values()) {
          content.push(`【${elem}】`)
        }
        return content.join(',')
      } else {
        return '暂无'
      }
    },
    changeUser(data) {
      const market_authorized_user = data.market_authorized_user
      const f_market_user = []
      for (let index = 0; index < market_authorized_user.length; index++) {
        const element = market_authorized_user[index]
        if (element.authorized_file_path) {
          f_market_user.push(element.user_code)
        }
      }
      this.temp.f_market_authorized_user = market_authorized_user
      this.temp.f_market_user = f_market_user
      this.getChargeList()
    },
    getCompanyList() {
      const code = this.code
      this.company_list = []
      getCompany(code).then(res => {
        res.data.list.map(v => {
          if (v.status === 1) {
            this.company_list.push(v)
          }
        })
      })
    },
    handleUpload(row) {
      this.dialogVisible = true
      this.upload_code = row.market_code
    },
    getChargeList() {
      this.charge_list = []
      for (const authorized of this.temp.f_market_authorized_user) {
        for (const contact of this.contact_list) {
          if (authorized.user_code === contact.contact_code) {
            if (authorized.user_code === this.temp.f_charge_user_code) {
              this.temp.f_charge_user_name = ''
            }
            this.charge_list.push(contact)
            break
          }
        }
      }
      this.charge_list = [...new Set(this.charge_list)] // this.charge_list = [...this.contact_list]
      // this.charge_list = [...this.contact_list]
      // for (const contact of this.charge_list) {
      //   for (const authorized of this.temp.f_market_authorized_user) {
      //     if (authorized.user_code === contact.contact_code) {
      //       if (authorized.user_code === this.temp.f_charge_user_code) {
      //         this.temp.f_charge_user_name = ''
      //       }
      //       const index = this.charge_list.indexOf(contact)
      //       this.charge_list.splice(index, 1)
      //       break
      //     }
      //   }
      // }
      // this.charge_list = [...new Set(this.charge_list)]
    },
    getContactList(code) {
      this.getCompanyList()
      contactList(code).then(
        res => {
          this.contact_list = res.data.list
          this.authorized_list = []
          res.data.list.map(v => {
            if (v.is_login_permission === 1 && v.status === 1) {
              this.authorized_list.push(v)
            }
          })
          this.getChargeList()
        }
      )
    },
    resetTemp() {
      this.charge_list = []
      this.temp = {
        f_group_code: '',
        f_company_code: '',
        f_market_name: '',
        f_currency_sign: '',
        f_currency_name: '',
        f_memo: '',
        f_cycle_days: '',
        f_cycle_type: 'day',
        f_charge_user_code: '',
        f_charge_user_name: '',
        f_market_authorized_user: [],
        f_market_user: []
      }
    },
    handleUpdate(row) {
      getMarket(row.market_code, '.market_table').then(res => {
        const tempObject = {}
        Object.keys(res.data).forEach((key) => {
          tempObject['f_' + key] = res.data[key]
        })
        tempObject.f_market_user = []
        for (let index = 0; index < tempObject.f_market_authorized_user.length; index++) {
          const element = tempObject.f_market_authorized_user[index]
          tempObject.f_market_user.push(element.user_code)
        }
        this.temp = Object.assign({}, tempObject)
        this.getContactList(this.code)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].$children[0].clearValidate()
        })
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
      this.temp.f_company_code = this.company_code
      this.getContactList(this.code)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].$children[0].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm(
        `此操作将${row.is_deleted === 0 ? '禁用' : '激活'}该市场, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteMarket({
            f_code: row.market_code,
            f_status: row.is_deleted === 0 ? 1 : 0
          }, '.marker_footer').then((res) => {
            this.$notify({
              title: '成功',
              message: res.msg,
              duration: 2000,
              type: 'success'
            })
            this.fetchData()
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
    getChargeListCode() {
      for (const v of this.contact_list) {
        if (v.user_email === this.temp.f_charge_user_name) {
          this.temp.f_charge_user_code = v.contact_code
          break
        }
      }
    },
    updateData() {
      if (this.temp.f_market_user.length <= 0 && this.temp.f_market_authorized_user.length > 0) {
        this.$message.error('市场负责人未上传授权文件！')
        return
      }
      this.$refs['dataForm'].$children[0].validate(valid => {
        if (valid) {
          this.getChargeListCode()
          const tempData = Object.assign({}, this.temp)
          const temp_authorized_user = []
          const temp_unauthorized_user = []
          for (const v of tempData.f_market_authorized_user) {
            if (v['authorized_file_path']) {
              temp_authorized_user.push(v)
            } else {
              temp_unauthorized_user.push(v)
            }
          }
          tempData.f_market_authorized_user = temp_authorized_user
          if (temp_unauthorized_user.length > 0) {
            this.$confirm('部分市场负责人未上传授权文件，不会保存该负责人，是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleSave(tempData)
            }).catch(() => {
              this.dialogFormVisible = false
            })
          } else {
            this.handleSave(tempData)
          }
        }
      })
    },
    handleSave(tempData) {
      delete tempData.f_market_user
      if (this.dialogStatus === 'create') {
        createMarket(tempData, '.marker_footer').then((res) => {
          this.fetchData()
          this.dialogFormVisible = false
        })
      }
      if (this.dialogStatus === 'update') {
        tempData.f_code = tempData.f_market_code
        delete tempData.f_market_code
        delete tempData.f_charge_list
        updateMarket(tempData, '.marker_footer').then((res) => {
          this.fetchData()
          this.dialogFormVisible = false
        })
      }
    },
    handleSizeChange(val) {
      this.listQuery.size = val
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
    },
    fetchData() {
      this.listLoading = true
      const code = this.code
      showGroup(code, '.market_table').then(res => {
        this.list = res.data.market_info
        this.total = res.data.market_info.length
        if (this.total === 0) {
          this.$notify({
            type: 'info',
            message: '暂无数据，请添加市场档案',
            duration: 2000
          })
        }
        try {
          this.$parent.getTotal('market', this.total)
        } catch (error) {
          console.log(error)
        }
        this.listLoading = false
      })
    }
  }
}
</script>
<style scoped>
.upload>>>.el-dialog__body{
  padding:10px 20px!important;
}
</style>

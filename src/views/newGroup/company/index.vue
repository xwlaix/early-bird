<template>
  <div>
    <div class="table-container">
      <el-button v-permission="['group:list:company:add','group:step']" size="small" type="primary" class="filter-item" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button-group class="right">
        <el-button class="filter-item " size="small" type="success" icon="el-icon-refresh" @click="handleRefresh" />
      </el-button-group>
    </div>
    <el-table
      :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)"
      :max-height="height"
      :height="height"
      :header-cell-style="{background:'rgb(240,247,255)',color:'#606266'}"
      row-key="id"
      style="width: calc(100% - 20px);margin:0 auto;"
      element-loading-text="Loading"
      size="mini"
      class="companyTable"
      column-key="actions"
      fit
      highlight-current-row
    >
      <el-table-column show-overflow-tooltip label="集团编码" min-width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.group_code }}
        </template>
      </el-table-column>
      <!-- <el-table-column show-overflow-tooltip align="center" label="公司编码" min-width="180">
        <template slot-scope="scope">
          {{ scope.row.company_code }}
        </template>
      </el-table-column> -->
      <el-table-column show-overflow-tooltip label="公司英文名称" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.en_name }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="公司中文名称" min-width="110">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="数据同步" min-width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.sync_type=='1'?'自动':'手动' }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="商洽片区" min-width="90" align="center">
        <template slot-scope="scope">
          {{ scope.row.area }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="公司状态" min-width="90" align="center">
        <template slot-scope="scope">
          {{ scope.row.status=='1'?'已激活':'已禁用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" show-overflow-tooltip min-width="180px">
        <template slot-scope="scope">
          <el-button v-permission="['group:list:company:update','group:step']" type="primary" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-permission="['group:list:company:handle','group:step']" :type="scope.row.status==1?'danger':'success'" size="mini" @click="handleDelete(scope.row)">{{ scope.row.status==1?'禁用':'激活' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body>
      <CompanyForm ref="dataForm" :temp="temp" />
      <div slot="footer" class="dialog-footer company__footer">
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
import { getCompany, addCompanyData, createCompany, updateCompany, deleteCompany } from '@/api/company'
import CompanyForm from './form' // Secondary package based on el-pagination
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  directives: { elDragDialog },
  components: { CompanyForm },
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
      code: this.$route.query.group_code,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        size: 10
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改【公司】',
        create: '添加【公司】'
      },
      temp: {
        f_code: '',
        f_name: '',
        f_en_name: '',
        f_group_code: '',
        f_sync_type: ''
      },
      rules: {
        f_name: [
          {
            required: true,
            message: '公司中文名称不能为空',
            trigger: 'blur'
          }
        ],
        f_en_name: [
          {
            required: true,
            message: '公司英文名称不能为空',
            trigger: 'blur'
          }
        ],
        f_sync_type: [
          {
            required: true,
            message: '请选择数据同步方式',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'company' || val.active === 3) {
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
      ? this.height = document.body.clientHeight - 34 - 385 + 25
      : this.height = document.body.clientHeight - 425 + 120
    if (this.status) {
      this.height = this.height - 120
    }
    this.code = this.code || this.value.code
  },
  methods: {
    getGroupData(code) {
      addCompanyData(code, '.companyTable').then(res => {
        const tempObject = {}
        if (code) {
          Object.keys(res.data).forEach((key) => {
            tempObject['f_' + key] = res.data[key]
          })
          this.temp = Object.assign({}, tempObject)
          this.temp.f_code = this.temp.f_company_code
          delete this.temp.f_company_code
          delete this.temp.f_group_code
        }
      })
    },
    resetTemp() {
      this.temp = {
        f_code: '',
        f_name: '',
        f_en_name: '',
        f_group_code: '',
        f_sync_type: '',
        f_area: '大陆'
      }
    },
    handleUpdate(row) {
      this.getGroupData(row.company_code)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
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
    handleDelete(row) {
      this.$confirm(
        `此操作将${row.status === 1 ? '禁用' : '激活'}该集团公司, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          (
            row.status === 1 ? (
              deleteCompany({
                f_code: row.company_code
              }, '.company__footer')
            ) : (
              updateCompany({ f_code: row.company_code, f_status: 1 }, '.company__footer')
            )
          ).then((res) => {
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
    // handledeletes() {
    //   if (this.selectArr.length === 0) {
    //     this.$message.error('请选中后提交！')
    //     return false
    //   }
    //   this.$confirm(`此操作将批量删除集团, 是否继续?`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const postArr = []
    //     this.selectArr.map((v, i) => {
    //       postArr.push(v.code)
    //     })
    //     deleteCompany({ f_codes: postArr }, '.el-message-box').then(res => {
    //       this.$notify({
    //         type: +res.status === 0 ? 'success' : 'error',
    //         message: res.message,
    //         duration: 2000
    //       })
    //       this.fetchData()
    //     })
    //   }).catch(() => {
    //     this.dialogFormVisible = false
    //     this.$notify({
    //       type: 'info',
    //       message: '已取消'
    //     })
    //   })
    // },
    updateData() {
      this.$refs['dataForm'].$children[0].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (this.dialogStatus === 'create') {
            createCompany(tempData, '.company__footer').then((res) => {
              this.fetchData()
              this.dialogFormVisible = false
            })
          }
          if (this.dialogStatus === 'update') {
            updateCompany(tempData, '.company__footer').then((res) => {
              this.fetchData()
              this.dialogFormVisible = false
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
    handleFilter() {
      this.fetchData()
    },
    fetchData() {
      if (this.code) {
        const code = this.code
        getCompany(code, '.companyTable').then(res => {
          this.list = res.data.list
          this.total = res.data.data_count
          if (this.total === 0) {
            this.$notify({
              type: 'info',
              message: '暂无数据，请新建公司信息',
              duration: 2000
            })
          }
          try {
            this.$parent.getTotal('company', this.total)
          } catch (error) {
            console.log(error)
          }
        })
      }
    }
  }
}
</script>


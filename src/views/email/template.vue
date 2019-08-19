<template>
  <div class="app-container calendar-list-container">
    <div v-if="filterStatus" class="filter-container">
      <el-input v-model.trim="listQuery.name" size="small" style="width: 200px;" clearable class="filter-item" placeholder="请输入邮件模板的名称" @clear="handleFilter" />
      <el-select v-model="listQuery.status" size="small" filterable class="filter-item" clearable placeholder="请选择邮件模板状态" @change="handleFilter">
        <el-option
          v-for="item in statusArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="listQuery.language" size="small" filterable class="filter-item" clearable placeholder="请选择邮件模板语言" @change="handleFilter">
        <el-option
          v-for="item in languageArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter" />
    </div>
    <div class="table-container">
      <el-button v-permission="['email:template:add']" class="filter-item left" icon="el-icon-plus" size="small" type="primary" @click="handleCreate">添加</el-button>
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

      <el-table-column show-overflow-tooltip align="center" label="名称" sortable sort-by="name" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="语言" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.language }}</span>
        </template>
      </el-table-column>
      <!-- ="custom"  -->
      <el-table-column show-overflow-tooltip align="center" label="邮件主题" sortable sort-by="subject" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.subject }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="状态" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.status==0?'无效':'有效' }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="创建时间" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip align="center" min-width="200">
        <template slot-scope="scope">
          <el-button v-permission="['email:template:update']" icon="el-icon-edit" type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-permission="['email:template:delete']" :type="scope.row.status==1?'danger':'success'" size="mini" @click="handleDelete(scope.row)">{{ scope.row.status==0?'激活':'禁用' }}</el-button>
        </template>

      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="75%">
      <el-form ref="dataForm" :rules="rules" :model="temp" class="dialog" label-position="right" label-width="6rem">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="temp.name" clearable placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="邮件主题" prop="subject">
          <el-input v-model.trim="temp.subject" clearable placeholder="请输入邮件主题" />
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-radio v-model="temp.language" label="english" style="margin-left:10px;width:90px">英文</el-radio>
          <el-radio v-model="temp.language" label="chinese" style="margin-left:10px;width:90px">中文</el-radio>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <tinymce ref="tinymce" v-model="temp.content" :height="400" />
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

import { listTemplates, getTemplates, createTemplates, updateTemplates, deleteTemplates } from '@/api/email'
import waves from '@/directive/waves' // 水波纹指令
import Tinymce from '@/components/Tinymce'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'EmailTemplate',
  components: { Tinymce, Pagination },
  directives: {
    waves
  },
  data() {
    return {
      height: document.body.clientHeight - 34 - 273,
      filterStatus: true,
      tableKey: 0,
      list: [],
      total: 0,
      statusArr: [
        {
          value: '1',
          label: '正常'
        }, {
          value: '0',
          label: '无效'
        }
      ],
      languageArr: [
        {
          value: 'english',
          label: '英文'
        }, {
          value: 'chinese',
          label: '中文'
        }
      ],
      listQuery: {
        page: 1,
        size: 10,
        name: '',
        status: '',
        language: ''
      },
      temp: {
        id: undefined,
        name: '',
        language: '',
        subject: '',
        content: '',
        status: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改【模板】',
        create: '添加【模板】'
      },
      rules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '邮件模板名称不能为空'
          }
        ],
        language: [
          {
            required: true,
            trigger: 'blur',
            message: '邮件模板语言不能为空'
          }
        ],
        subject: [
          {
            required: true,
            trigger: 'blur',
            message: '邮件模板主题不能为空'
          }
        ],
        content: [
          {
            required: true,
            trigger: 'blur',
            message: '邮件模板内容不能为空'
          }
        ]
      }
    }
  },

  created() {
    this.getList()
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
        name: '',
        status: ''
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
        name: '',
        language: '',
        subject: '',
        content: '',
        status: '1'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      try {
        this.$refs['tinymce'].setContent(this.temp.content)
      } catch (error) {
        console.log(error)
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createTemplates(this.temp, '.el-dialog__footer')
            .then(res => {
              if (res.code === 200) {
                this.getList()
                this.dialogFormVisible = false
              }
              this.$notify({
                title: '结果',
                message: res.msg || '操作成功',
                duration: 2000,
                type: +res.code === 200 ? 'success' : 'error'
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.resetTemp()
      getTemplates(row.id, '.table').then((res) => {
        this.temp = Object.assign(this.temp, res.data) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        try {
          this.$refs['tinymce'].setContent(this.temp.content)
        } catch (error) {
          console.log(error)
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateTemplates(tempData, '.el-dialog__footer').then(res => {
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
        `此操作将${+row.status === 0 ? '激活' : '禁用'}该模板, 是否继续?`,
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          (+row.status === 0
            ? updateTemplates(Object.assign(row, { status: +row.status === 0 ? 1 : 0 }), '.el-message-box')
            : deleteTemplates({ id: row.id }, '.el-message-box'))
            .then(res => {
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
      listTemplates(this.listQuery, '.table').then(res => {
        this.list = res.data.list || []
        this.total = res.data.data_count || 0
      })
    }
  }
}
</script>

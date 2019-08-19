<template>
  <div class="app-container">
    <div class="table-container">
      <el-button class="filter-item" icon="el-icon-plus" size="small" type="primary" @click="handleCreate">添加</el-button>
    </div>
    <el-table
      :data="treeDataSource"
      :max-height="height"
      :header-cell-style="{background:'rgb(240,247,255)',color:'#606266'}"
      :border="false"
      class="table"
      style="padding-right:10px;padding-left:10px;margin:0 auto;"
      row-key="id"
      size="mini"
      highlight-current-row
      element-loading-text="给我一点时间"
    >
      <el-table-column show-overflow-tooltip label="菜单名" min-width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="权限标识" min-width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.permission }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button v-permission="['setting:menu:add']" icon="el-icon-plus" size="mini" type="primary" @click="handleCreate(scope.row)">添加</el-button>
          <el-button v-permission="['setting:menu:update']" icon="el-icon-edit" size="mini" type="primary" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-permission="['setting:menu:handle']" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button v-permission="['setting:menu:handle']" :type="scope.row.status==1?'danger':'success'" size="mini" @click="handleEnable(scope.row)">{{ scope.row.status==1?'禁用':'启用' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" class="dialog" label-position="right" label-width="9rem">
        <el-form-item v-if="dialogStatus=='create'" label="父级菜单" prop="pid">
          <el-select v-model="temp.pid" class="filter-item parentId" filterable clearable placeholder="请选择父级菜单">
            <el-option
              v-for="item in parentIdArr"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="主菜单名称" prop="title">
          <el-input v-model.trim="temp.title" clearable />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model.trim="temp.permission" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { menus, menusSave, menusDelete, menusUpdate, menusEnables } from '@/api/stageuser'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'SettingMenu',
  directives: { elDragDialog },
  data() {
    return {
      height: document.body.clientHeight - 34 - 143,
      expandAll: true,
      list: [],
      textMap: {
        create: '添加【菜单】',
        update: '修改【菜单】'
      },
      dialogStatus: '',
      parentIdArr: [],
      temp: {
        pid: 0,
        title: '',
        permission: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入主菜单名称！', trigger: 'blur' }
        ],
        pid: [
          { required: true, message: '父级菜单不能为空！', trigger: 'blur' }
        ]
      },
      treeDataSource: [],
      dialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    resetTemp() {
      this.temp = {
        pid: 0,
        title: '',
        permission: ''
      }
    },
    toggleExpanded(value) {
      value._expanded = !value._expanded
    },
    handleCreate(row) {
      this.resetTemp()
      this.temp.pid = row.id || 0
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.parentIdArr = this.list.filter(l => +l.pid === row.pid)
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          if (this.dialogStatus === 'create') {
            menusSave(tempData, '.el-dialog__footer').then(res => {
              this.$notify({
                type: +res.code === 200 ? 'success' : 'error',
                message: res.msg,
                duration: 2000
              })
              if (+res.code === 200) {
                this.dialogFormVisible = false
                this.getList('sec')
              }
            })
          }
          if (this.dialogStatus === 'update') {
            menusUpdate({
              pid: tempData.pid,
              title: tempData.title,
              permission: tempData.permission,
              id: tempData.id
            }, '.el-dialog__footer').then(res => {
              this.$notify({
                type: +res.code === 200 ? 'success' : 'error',
                message: res.msg,
                duration: 2000
              })
              if (+res.code === 200) {
                this.dialogFormVisible = false
                this.getList('sec')
              }
            })
          }
        }
      })
    },
    handleEnable(row) {
      this.$confirm(
        `此操作将${row.status === 0 ? '启用' : '禁用'}该菜单, 是否继续?`,
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          menusEnables({
            ids: [row.id], status: row.status === 0 ? 1 : 0
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
    handleDelete(row) {
      this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        menusDelete({
          id: row.id
        }, '.el-message-box').then(res => {
          this.$notify({
            type: +res.code === 200 ? 'success' : 'error',
            message: res.msg,
            duration: 2000
          })
          if (+res.code === 200) {
            this.getList('sec')
          }
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消',
          duration: 2000
        })
      })
    },
    TreeData() {
      // 取父节点
      const parentArr = this.list.filter(l => +l.pid === 0)
      this.treeDataSource = this.getTreeData(this.list, parentArr)
    },
    // 这里处理没有children结构的数据
    getTreeData(list, dataArr) {
      dataArr.map((pNode, i) => {
        const childObj = []
        list.map((cNode, j) => {
          if (+pNode.id === +cNode.pid) {
            childObj.push(cNode)
          }
        })
        pNode.children = childObj
        if (childObj.length > 0) {
          this.getTreeData(list, childObj)
        }
      })
      return dataArr
    },
    // filterNode(value, data) {
    //   if (!value) return true
    //   return data.label.indexOf(value) !== -1
    // },
    getList(type) {
      menus('.table').then(res => {
        if (res.code === 200) {
          this.list = res.data
          this.TreeData()
        }
      })
    }
  }
}
</script>
<style scoped>
.app-container{
  height: 100%;
}
</style>


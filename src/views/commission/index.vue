<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix header">
        <svg-icon icon-class="discount" />
        <span>费率设置</span>
      </div>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd()">新增</el-button>
      <iTable
        :max-height="height"
        :height="height"
        :data="list"
        :show-header="false"
        :col-configs="configs"
        row-class-name="tableClass"
        highlight-current-row
        class="commission_table"
        row-key="id"
        style="padding:0!important;"
      >
        <el-table-column slot="one" show-overflow-tooltip align="left">
          <template slot-scope="scope">
            名称：{{ scope.row.name }}
            <br>
            小于1亿：{{ scope.row.country_name }}
          </template>
        </el-table-column>
        <el-table-column slot="two" show-overflow-tooltip align="left">
          <template slot-scope="scope">
            币别：{{ scope.row.num }}
            <br>
            1亿—-5亿：{{ scope.row.country_name }}
          </template>
        </el-table-column>
        <el-table-column slot="three" show-overflow-tooltip align="left">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.num" active-text="启用" @change="changeSwitch" />
            <br>
            大于5亿：{{ scope.row.num }}
          </template>
        </el-table-column>
        <el-table-column slot="four" show-overflow-tooltip align="left">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button type="success" size="mini" @click="handleScope(scope.row)">应用范围</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
            <br>
          </template>
        </el-table-column>
      </iTable>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <commissionForm v-if="dialogStatus!=='scope'" ref="dataForm" :temp="temp" :text-arr="textArr" />
        <commissionScope v-else :id="id" ref="dataScope" />
        <div slot="footer" class="dialog-footer company__footer">
          <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="small" type="primary" @click="updateData">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import iTable from '@/components/Table'
import commissionForm from './Form/index'
import commissionScope from './Scope/index'
import elDragDialog from '@/directive/el-drag-dialog'

import { get_group } from '@/api/group'

export default {
  name: 'Commission',
  directives: { elDragDialog },

  components: {
    iTable,
    commissionForm,
    commissionScope
  },
  data() {
    return {
      height: document.body.clientHeight - 40 - 39 - 40 - 35 - 84,
      list: [],
      configs: [{ slot: 'four' }, { slot: 'one' }, { slot: 'two' }, { slot: 'three' }],
      textMap: {
        'update': '修改',
        'add': '新增',
        'scope': '应用范围'
      },
      textArr: [{}],
      temp: {

      },
      id: '',
      dialogStatus: '',
      dialogFormVisible: false
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {},
  methods: {
    changeSwitch(value) {
      console.log(value)
    },
    handleAdd() {
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      console.log(1)
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].$children[0].clearValidate()
      })
    },
    handleScope() {
      this.dialogStatus = 'scope'
      console.log(this.textMap[this.dialogStatus])
      this.dialogFormVisible = true
    },
    handleDelete(row) {
      this.$confirm(
        `此操作将${row.status === 1 ? '禁用' : '激活'}该规则，是否继续`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        console.log(row.status)
      })
    },
    updateData() {
      this.$refs['dataForm'].$children[0].validate(valid => {
        if (valid) {
          console.log(this.temp)
          console.log(this.textArr)
        }
      })
    },
    fetchData() {
      get_group().then(res => {
        this.list = res.data.list
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-left:0!important; margin-right: 0!important;">
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="4" style="padding-left:0;">
        <el-card class="box-card leftTable">
          <div slot="header" class="clearfix header">
            <svg-icon icon-class="suppliers" />
            <span>集团名称</span>
          </div>
          <leftTable ref="leftTable" @handleChange="handleChange" @handleAdd="handleAdd" />
        </el-card>
      </el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="18" :xl="20">
        <el-card class="box-card">
          <div slot="header" class="clearfix header">
            <svg-icon icon-class="suppliers" />
            <span>{{ name }}档案详情</span>
          </div>
          <baseInfo :code="code" :status="status" @handleUpdate="handleUpdate" @changeStatus="changeStatus" />
          <detail :code="code" :status="status" :name="name" />
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <GroupForm ref="dataForm" :temp="temp" :select-temp="selectTemp" />
      <div slot="footer" class="dialog-footer group_footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleAdd" :show-close="showClose" :close-on-press-escape="showClose" title="买家建档" fullscreen>
      <Step v-if="addDone" @handDone="handDone" />
    </el-dialog>
  </div>
</template>

<script>
import baseInfo from './baseInfo'
import detail from './detail'
import leftTable from './leftTable'
import { addGroupData, createGroup, updateGroup } from '@/api/group'
import GroupForm from './form'
import Step from './step'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'GroupManage',
  directives: { elDragDialog },
  components: { leftTable, detail, baseInfo, GroupForm, Step },
  data() {
    return {
      dialogFormVisible: false,
      dialogVisibleAdd: false,
      addDone: true,
      dialogStatus: '',
      code: '',
      name: '',
      showClose: true,
      textMap: {
        update: '修改【集团】',
        create: '添加【集团】'
      },
      selectTemp: {},
      temp: {},
      status: false
    }
  },
  methods: {
    handDone(type) {
      if (type !== 'first') {
        this.dialogVisibleAdd = false
        if (type === 'done') {
          this.addDone = false
        }
        this.$refs.leftTable.fetchData()
      } else {
        this.showClose = false
      }
    },
    changeStatus() {
      this.status = !this.status
    },
    getGroupData(code, showLoading, dialogStatus) {
      this.dialogFormVisible = true
      addGroupData(code, showLoading).then(res => {
        this.selectTemp = Object.assign({}, res.data)
        const tempObject = {}
        if (code) {
          Object.keys(res.data.info).forEach((key) => {
            tempObject['f_' + key] = res.data.info[key]
          })
          this.temp = Object.assign({}, tempObject)
        }
        this.dialogStatus = dialogStatus
        this.$nextTick(() => {
          this.$refs.dataForm.setAddress()
          this.$refs['dataForm'].$children[0].clearValidate()
        })
      })
    },
    resetTemp() {
      this.temp = {
        f_code: '',
        f_name: '',
        f_web_site: '',
        f_group_number: '',
        f_industry_id: '',
        f_country_id: '',
        f_type_id: '',
        f_contact_phone: '',
        f_address: '',
        f_fiscal_month: '',
        f_seller_id: ''
      }
      this.selectTemp = {
        industrys: [],
        countrys: [],
        types: []
      }
    },
    handleChange(row) {
      this.code = row.code
      this.name = row.name
    },
    handleUpdate() {
      this.getGroupData(this.code, '.group_container', 'update')
    },
    handleAdd() {
      this.dialogVisibleAdd = true
      this.addDone = true
    },
    updateData() {
      this.$refs['dataForm'].$children[0].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (this.dialogStatus === 'create') {
            createGroup(tempData, '.group_footer').then((res) => {
              this.dialogFormVisible = false
              this.$refs.leftTable.fetchData()
            })
          }
          if (this.dialogStatus === 'update') {
            updateGroup(tempData, '.group_footer').then((res) => {
              this.dialogFormVisible = false
              this.$refs.leftTable.fetchData()
            })
          }
        }
      })
    }
  }
}
</script>

<style  scoped>
  .el-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .left-content{
    height: 100%;
  }
  .top-content{
    height: 400px;
  }
  .leftTable>>>.el-card__body{
    padding: 0!important ;
    background: rgba(66, 62, 80, 0.05);
  }
  .app-container>>>.el-card__body{
    padding: 3px ;
    background: rgba(66, 62, 80, 0.05);
  }
  .el-card{
    border:none;
  }
</style>

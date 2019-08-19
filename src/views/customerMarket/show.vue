<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-left:0!important; margin-right: 0!important;">
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="4" style="padding-left:0;">
        <el-card class="box-card leftTable">
          <div slot="header" class="clearfix header">
            <span>请选择买家建立的市场</span>
          </div>
          <leftTable ref="leftTable" @handleChange="handleChange" />
        </el-card>
      </el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="18" :xl="20">
        <el-card class="box-card">
          <div slot="header" class="clearfix header">
            <svg-icon icon-class="suppliers" />
            <span>{{ name }}</span>
          </div>
          <tabs :name="code" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tabs from './tabs/index'
import leftTable from './leftTable/index'

export default {
  name: 'CustomerMarket',
  components: { leftTable, tabs },
  data() {
    return {
      code: '',
      name: '',
      status: false
    }
  },
  methods: {
    changeStatus() {
      this.status = !this.status
    },
    handleChange(row) {
      this.code = row.market_code
      this.name = row.market_name
    }

  }
}
</script>

<style  scoped>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
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
    padding: 5px ;
    background: rgba(66, 62, 80, 0.05);
  }
  .el-card{
    border:none;
  }
</style>

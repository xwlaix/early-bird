<template>
  <div class="dashboard-editor-container">
    <panel />
    <el-card class="box-card">
      <div slot="header" class="clearfix header">
        <svg-icon icon-class="line-chart" />
        <span>今日市场动态列表</span>
      </div>
      <Table />
    </el-card>
  </div>
</template>

<script>
import Panel from './Panel'
import Table from './todayTable'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  name: 'Dashboard',
  components: {
    Panel,
    Table
  },
  data() {
    return {}
  },
  methods: {
    checkPermission,
    handleSetLineChartData(type) {
      // this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style  scoped>
.dashboard-editor-container {
  padding: 16px;
  background-color: rgb(240, 242, 245);
}
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 16px;
}
.box-card >>> .el-card__body {
  padding: 0 !important;
}
</style>


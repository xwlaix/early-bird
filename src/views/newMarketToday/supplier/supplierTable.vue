<template>
  <el-row class="row">
    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
      <pieNest :chart-data="pieNestData" :height="height" />
    </el-col>
    <el-col :xs="24" :sm="12" :md="16" :lg="18" :xl="18" class="tableWrap">
      <joinTable :height="height" :code="code" />
    </el-col>
  </el-row>
</template>

<script>
import pieNest from './pieNest'
import joinTable from './joinTable'
import { supplier_nested_pie } from '@/api/marketDetail'

export default {
  components: { joinTable, pieNest },
  props: {
    height: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pieNestData: {}
    }
  },
  watch: {
    code() {
      this.getPieNestData()
    }
  },
  created() {
    this.getPieNestData()
  },
  methods: {
    getPieNestData() {
      supplier_nested_pie({ market_code: this.code }).then(res => {
        this.pieNestData = Object.assign({}, res.data)
      })
    }
  }
}
</script>
<style scoped>
.pieNest>>>.el-card__body {
  padding: 0!important;
}
.row{
  margin-left:0!important; margin-right: 0!important;
}
.tableWrap{
  position: absolute;
  top: 6px;
  right: 0;
}
.tableWrap>>>.el-table{
  padding: 0!important;
}
</style>


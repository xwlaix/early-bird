<template>
  <el-row class="row">
    <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
      <funnel :data="data" @changeType="changeType" />
    </el-col>
    <el-col :xs="24" :sm="12" :md="18" :lg="18" :xl="18">
      <payTable :data="data" :judge="judge" :is-fullscreen="isFullscreen" />
    </el-col>
  </el-row>
</template>

<script>
import funnel from './funnel'
import payTable from './payTable'
import { current_invoice_stat } from '@/api/marketDetail'

export default {
  components: { funnel, payTable },
  props: {
    code: {
      type: String,
      default: ''
    },
    isFullscreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: {},
      judge: ''
    }
  },
  watch: {
    code() {
      this.fetchData()
    }
  },
  created() {
    this.changeType('valid')
    this.fetchData()
  },
  methods: {
    changeType(type) {
      this.judge = type
    },
    fetchData() {
      if (!this.code) {
        return false
      }
      current_invoice_stat({ market_code: this.code }).then(res => {
        this.data = Object.assign({}, res.data)
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

</style>


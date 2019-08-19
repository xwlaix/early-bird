<template>
  <div>
    <baseInfo v-if="checkPermission(['market:buyers:detail:base'])" :data="data" :status="status" class="baseInfo" @changeStatus="changeStatus" />
    <el-tabs v-model="active" :class="{ active: status }" type="card" class="el-tabs">
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:dynamic'])" :lazy="true" label="活跃监控" name="active">
        <active :value="value" :status="status" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:plan'])" :lazy="true" label="参与市场详情" name="market">
        <market :value="value" :status="status" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:clear'])" :lazy="true" label="用户信息" name="userInfo">
        <userInfo :value="value" :status="status" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:log'])" :lazy="true" label="操作轨迹" name="log">
        <log :value="value" :status="status" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { buyer_market_read } from '@/api/marketBuyer'
import baseInfo from './baseInfo'
import active from './active'
import market from './market'
import userInfo from './userInfo'
import log from './log'
import checkPermission from '@/utils/permission'
export default {
  components: {
    baseInfo,
    active,
    market,
    userInfo,
    log
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      active: 'active',
      data: {},
      status: false
    }
  },
  computed: {
    value() {
      return { name: this.name, active: this.active }
    }
  },
  watch: {
    name() {
      this.getBase()
    }
  },
  created() {
    this.getBase()
  },
  methods: {
    checkPermission,
    changeStatus() {
      this.status = !this.status
      if (this.status) {
        this.getBase()
      }
    },
    getBase() {
      if (checkPermission(['market:buyers:detail:base']) && this.status) {
        buyer_market_read({ market_code: this.name }, '.baseInfo').then(res => {
          this.data = res.data || {}
        })
      }
    }

  }
}
</script>
<style scoped>
.el-tabs >>> .el-tabs__content,
.el-tabs >>> .is-active {
  background: #fff;
}
.active{
  margin-top:10px!important;
}
.active.el-tabs>>>.el-tabs__content{
  height: calc(100vh - 338px)!important;
  overflow: auto;
}
.el-tabs>>>.el-tabs__content{
  height: calc(100vh - 218px)!important;
  overflow: auto;
}
.el-tabs >>> .el-tabs__header {
  margin: 0;
  padding-right: 90px;
}
.el-tabs >>> .el-tabs__item {
  border: none!important;
}
.el-tabs >>> .el-tabs__nav {
  border: none!important;
}
</style>


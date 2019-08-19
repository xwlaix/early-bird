<template>
  <div>
    <baseInfo v-if="checkPermission(['market:buyers:detail:base'])" :data="data" :status="status" class="baseInfo" @changeStatus="changeStatus" />
    <el-tabs v-model="active" :class="{ active: status }" type="card" class="el-tabs">
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:dynamic'])" :lazy="true" label="市场动态" name="dynamic">
        <dynamic :value="value" :status="status" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:plan'])" :lazy="true" label="资金计划" name="plan">
        <plan :value="value" :status="status" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:clear'])" :lazy="true" label="清算历史" name="clear">
        <clear :value="value" :status="status" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:supplier'])" :lazy="true" label="供应商信息" name="supplier">
        <supplier :value="value" :status="status" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:log'])" :lazy="true" label="操作轨迹" name="log">
        <log :value="value" :status="status" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:log'])" :lazy="true" label="开价监控" name="offer">
        <offer :value="value" :status="status" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:illegal'])" :lazy="true" label="违规记录" name="illegal">
        <illegal :value="value" :status="status" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['market:buyers:detail:illegal'])" :lazy="true" label="发票信息" name="invoice">
        <invoice :value="value" :status="status" />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { buyer_market_read } from '@/api/marketBuyer'
import baseInfo from './baseInfo'
import dynamic from './dynamic'
import plan from './plan'
import clear from './clear'
import supplier from './supplier'
import log from './log'
import offer from './offer'
import illegal from './illegal'
import invoice from './invoice'
import checkPermission from '@/utils/permission'
export default {
  components: {
    baseInfo,
    dynamic,
    plan,
    clear,
    supplier,
    offer,
    log,
    illegal,
    invoice
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      active: checkPermission(['market:buyers:detail:dynamic']) ? 'dynamic'
        : checkPermission(['market:buyers:detail:plan']) ? 'plan'
          : checkPermission(['market:buyers:detail:clear']) ? 'clear'
            : checkPermission(['market:buyers:detail:supplier']) ? 'supplier'
              : checkPermission(['market:buyers:detail:log']) ? 'log'
                : checkPermission(['group:list:extend:illegal']) ? 'illegal' : '',
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


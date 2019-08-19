<template>
  <div class="app-container">
    <el-row :gutter="10" style="margin-left:0!important; margin-right: 0!important;">
      <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="4" style="padding-left:0;">
        <el-card class="box-card leftTable">
          <div slot="header" class="clearfix header">
            <span>今日活跃市场</span>
          </div>
          <leftTable ref="leftTable" @handleChange="handleChange" />
        </el-card>
      </el-col>
      <el-col :xs="16" :sm="16" :md="16" :lg="18" :xl="20">
        <div class="fullscreen">
          <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
        </div>
        <headerTab :code="code" />
        <contentTab v-if="!isFullscreen" :code="code" :get-type-str="maxType" @getType="getType" />
      </el-col>
    </el-row>
    <el-dialog v-if="isFullscreen" :visible.sync="isFullscreen" class="FullscreenDialog" fullscreen :show-close="false">
      <div class="fullscreen">
        <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
      </div>
      <headerTab :code="code" />
      <contentTab :code="code" :is-fullscreen="true" :get-type-str="minType" @getType="getType" />
    </el-dialog>
  </div>
</template>

<script>
import leftTable from './leftTable/index'
import headerTab from './header/index'
import contentTab from './content/index'

export default {
  name: 'NewMarketToday',
  components: { leftTable, headerTab, contentTab },
  data() {
    return {
      code: '',
      name: '',
      minType: '',
      maxType: '',
      isFullscreen: false
    }
  },
  methods: {
    click() {
      this.isFullscreen = !this.isFullscreen
    },
    getType(type) {
      if (this.isFullscreen) {
        this.maxType = type
      } else {
        this.minType = type
      }
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
.FullscreenDialog>>>.el-dialog__header{
display: none;
}
.FullscreenDialog>>>.el-dialog__body{
  padding:10px;
}
.fullscreen {
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  color: red;
  z-index: 100;
}
.left-content {
  height: 100%;
}
.top-content {
  height: 400px;
}
.leftTable >>> .el-card__body {
  padding: 0 !important ;
  background: rgba(66, 62, 80, 0.05);
}
.app-container >>> .el-card__body {
  padding: 5px;
  background: rgba(66, 62, 80, 0.05);
}

.el-card {
  border: none;
}
</style>

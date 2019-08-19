<template>
  <div>
    <div class="block" :style="blockStyle">
      <el-timeline v-if="list.length>0">
        <el-timeline-item
          v-for="(activity, index) in list"
          :key="index"
          :hide-timestamp="true"
          :icon="index==0?'el-icon-caret-top':''"
          :type="index==0?'primary':''"
          :color="index==0?'#409EFF':''"
          :timestamp="activity.operation_time"
          placement="top"
        >
          <!-- <span slot="dot"><svg-icon :icon-class="iconMap(activity.icon)" /></span> -->
          <el-card>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <i class="el-icon-date" style="margin-right:10px;" />
                  {{ activity.operation_time }}
                </div>
              </el-col>
              <el-col :span="6">
                <div
                  class="grid-content bg-purple"
                >{{ activity.company_name }},{{ activity.operation_type }}</div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">操作用户：{{ activity.operation_user }}</div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:5px;">
              <el-col v-for="(val, key,indexItem) in activity.operation_data" :key="key" :span="6">
                <div
                  class="grid-content bg-purple"
                  style="margin-top:5px;"
                  :class="{first:(indexItem+1)%4==1}"
                >{{ key }}：{{ val }}</div>
              </el-col>
            </el-row>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div v-else class="noData">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { marketOperation } from '@/api/marketDetail'
export default {
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
      list: [],
      total: 0,
      listQuery: {
        market_code: '',
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    blockStyle() {
      return { height: (document.body.clientHeight - (this.isFullscreen ? 168 : 268)) + 'px !important' }
    }
  },
  watch: {
    code() {
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listQuery.market_code = this.code
      marketOperation(this.listQuery, '.block').then(res => {
        this.list = res.data
      })
    }
  }
}
</script>
<style scoped>
.block>>>.el-timeline{
padding: 10px;
}
.block{
  height: 350px;
  overflow: auto;
}
.block >>> .el-timeline-item__node {
 background: transparent!important;
}
.block >>> .el-timeline-item__icon {
  color: #409eff !important;
  font-size: 40px !important;
}
.noData {
  margin-top: 50px;
  text-align: center;
}
.first {
  margin-left: 24px;
}
.grid-content{
  white-space: nowrap;
}
</style>


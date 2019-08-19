<template>
  <div>
    <div class="table-container market_container">
      <el-select
        v-model="listQuery.role"
        filterable
        size="small"
        placeholder="请选择用户类型"
        style="width:80px"
        @change="fetchData"
      >
        <el-option
          v-for="item in typeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="listQuery.search_key"
        clearable
        size="small"
        style="width:180px"
        placeholder="公司名称/用户/操作名称"
      />
      <el-date-picker
        v-model="time"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        unlink-panels
        end-placeholder="结束日期"
        size="small"
      />
      <el-button
        size="small"
        type="primary"
        icon="el-icon-search"
        @click="fetchData"
      />
      <el-button
        size="small"
        type="success"
        icon="el-icon-refresh"
        @click="handleRefresh"
      />
    </div>
    <div class="block">
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
    value: {
      type: Object,
      required: true
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      time: '',
      market_code: '',
      listQuery: {
        search_key: '',
        market_code: '',
        start_date: '',
        end_date: '',
        role: '',
        page: 1,
        size: 10
      },
      typeArr: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'buyer',
          label: '买家'
        },
        {
          value: 'vendor',
          label: '供应商'
        }
      ]
    }
  },
  computed: {
    height() {
      return document.body.clientHeight - 433 + (this.status ? 0 : 120)
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'log') {
          this.market_code = this.value.name
        }
      }
    },
    market_code() {
      this.fetchData()
    },
    time(val) {
      if (val) {
        this.listQuery.start_date = val[0]
        this.listQuery.end_date = val[1]
      }
    }
  },
  created() {
    this.market_code = this.value.name
  },
  methods: {
    handleRefresh() {
      this.listQuery = {
        search_key: '',
        market_code: '',
        start_date: '',
        end_date: '',
        role: '',
        page: 1,
        size: 10
      }
      this.time = []
      this.fetchData()
    },

    fetchData() {
      this.listQuery.market_code = this.value.name
      marketOperation(this.listQuery, '.block').then(res => {
        this.list = res.data
      })
    }
  }
}
</script>
<style scoped>
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


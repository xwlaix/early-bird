<template>
  <div>
    <div class="table-container market_container">
      <el-date-picker
        v-model="time"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="~"
        start-placeholder="选择开始日期"
        unlink-panels
        end-placeholder="结束日期"
        class="filter-item"
        size="small"
      />
      <el-button size="small" type="primary" class="filter-item" icon="el-icon-search" @click="fetchData" />
      <el-button size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh" />
    </div>
    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :hide-timestamp="true"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp"
          placement="top"
        >
          <!-- <span slot="dot"><svg-icon :icon-class="iconMap(activity.icon)" /></span> -->
          <el-card>
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="grid-content bg-purple">{{ activity.timestamp }}</div>
                <br>
                <div class="grid-content bg-purple">姓名：{{ activity.content }}</div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">{{ activity.action }}</div>
                <br>
                <div class="grid-content bg-purple">职位：{{ activity.content }}</div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">激活账号：{{ activity.timestamp }}</div>
                <br>
                <div class="grid-content bg-purple">联系电话：{{ activity.content }}</div>
              </el-col>
              <el-col :span="6">
                <br>
                <br>
                <div class="grid-content bg-purple">邮件语言：{{ activity.content }}</div>
              </el-col>
            </el-row>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { market_operation } from '@/api/marketBuyer'
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
      activities: [{
        content: '支持使用图标',
        timestamp: '2018-04-12 20:46',
        size: 'large',
        type: 'primary',
        action: '操作类型',
        icon: 'el-icon-more'
      }, {
        content: '支持自定义颜色',
        timestamp: '2018-04-03 20:46',
        action: '操作类型',
        color: '#0bbd87'
      }, {
        content: '支持自定义尺寸',
        action: '操作类型',
        timestamp: '2018-04-03 20:46',
        size: 'large'
      }, {
        content: '默认样式的节点',
        action: '操作类型',
        timestamp: '2018-04-03 20:46'
      }],
      list: [],
      total: 0,
      configs: [
        { slot: 'operation' },
        { prop: 'create_time', label: '操作日期', minWidth: '100px' },
        { prop: 'operation_data', label: '操作详情', minWidth: '180px' },
        { prop: 'operation_ip', label: '操作ip', numFormat: true, minWidth: '110px' },
        { prop: 'create_user', label: '操作账号', numFormat: true, minWidth: '110px' }
      ],
      market_code: '',
      time: '',
      listQuery: {
        market_code: '',
        start_date: '',
        end_date: '',
        operation_type: '',
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    height() {
      return document.body.clientHeight - 371 + (this.status ? 0 : 104)
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
        operation_type: '',
        start_date: '',
        end_date: '',
        page: 1,
        size: 10
      }
      this.time = []
      this.fetchData()
    },

    fetchData() {
      this.listQuery.market_code = this.value.name
      market_operation(this.listQuery, '.block').then(res => {
        this.list = res.data.list
        this.total = res.data.data_count
      })
    }
  }
}
</script>

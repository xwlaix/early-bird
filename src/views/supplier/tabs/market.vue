<template>
  <div>
    <!-- <div class="table-container market_container">
      <el-select v-model="listQuery.operation_type" class="filter-item" filterable size="small" placeholder="请选择市场">
        <el-option
          v-for="item in typeArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button size="small" type="primary" class="filter-item" icon="el-icon-search" @click="fetchData"/>
      <el-button size="small" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh"/>
    </div> -->
    <iTable
      :max-height="height"
      :height="height"
      :data="list"
      :col-configs="configs"
      class="log"
      row-key="id"
    >
      <el-table-column slot="market_status" show-overflow-tooltip label="状态" min-width="100px" align="center">
        <template slot-scope="scope">
          {{ market_status[scope.row.market_status] }}
        </template>
      </el-table-column>
      <el-table-column slot="online" show-overflow-tooltip label="在线" min-width="100px" align="center">
        <template>
          <svg-icon icon-class="earth" class="svg_bg" />
        </template>
      </el-table-column>
    </iTable>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { market_operation } from '@/api/marketBuyer'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  components: {
    iTable,
    Pagination
  },
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
      total: 0,
      configs: [
        { slot: 'online' },
        { prop: 'create_user', label: '市场名称', minWidth: '110px' },
        { prop: 'create_user', label: '清算总额', minWidth: '100px' },
        { prop: 'create_user', label: '折扣总额', minWidth: '100px' },
        { prop: 'create_time', label: '平均年化率', minWidth: '90px' },
        { prop: 'operation_data', label: '平均提早天数', minWidth: '90px' },
        { prop: 'operation_data', label: '注册时间', minWidth: '100px' },
        { prop: 'operation_data', label: '用户数', minWidth: '90px' },
        { prop: 'operation_data', label: '复参次数', minWidth: '90px' },
        { prop: 'create_time', label: '上一次参与时间', minWidth: '120px' },
        { slot: 'market_status' }
      ],
      market_code: '',
      listQuery: {
        market_code: '',
        operation_type: '',
        page: 1,
        size: 10
      },
      market_status: {
        '-5': '市场停用',
        '-4': '未初始化',
        '-3': '无可清算',
        '-2': '资金不足',
        '-1': '买家关闭',
        0: '次日开市',
        1: '活跃交易'
      },
      typeArr: [
        {
          value: 'upload_payment',
          label: '上传应付'
        }, {
          value: 'upload_supplier',
          label: '上传供应商'
        }, {
          value: 'upload_user',
          label: '上传供应商用户'
        }, {
          value: 'modifiy_setting',
          label: '修改资金池'
        }, {
          value: 'add_plan',
          label: '添加计划'
        }, {
          value: 'modify_plan',
          label: '修改计划'
        }, {
          value: 'delete_plan',
          label: '删除计划'
        }, {
          value: 'open_market',
          label: '打开市场'
        }, {
          value: 'close_market',
          label: '关闭市场'
        }
      ]
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
        if (val.active === 'market') {
          this.market_code = this.value.name
        }
      }
    },
    market_code() {
      this.fetchData()
    }
  },
  created() {
    this.market_code = this.value.name
  },
  methods: {
    handleRefresh() {
      this.listQuery = {
        operation_type: '',
        page: 1,
        size: 10
      }
      this.fetchData()
    },

    fetchData() {
      this.listQuery.market_code = this.value.name
      market_operation(this.listQuery, '.log').then(res => {
        this.list = res.data.list
        this.total = res.data.data_count
      })
    }
  }
}
</script>

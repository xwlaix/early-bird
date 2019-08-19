<template>
  <div>
    <div class="table-container market_container">
      <el-input
        v-model.trim="listQuery.search_key"
        size="mini"
        clearable
        class="filter-item name"
        placeholder="邮箱/市场/联系人"
        style="width:150px;"
        @clear="fetchData"
      />
      <el-button size="mini" type="primary" class="filter-item" icon="el-icon-search" @click="fetchData" />
      <el-button size="mini" type="success" class="filter-item" icon="el-icon-refresh" @click="handleRefresh" />
    </div>
    <iTable
      :max-height="height"
      :height="height"
      :data="list"
      :col-configs="configs"
      class="userInfo"
      row-key="id"
    >
      <el-table-column slot="status" show-overflow-tooltip label="在线状态" min-width="100px" align="center">
        <template slot-scope="scope">
          {{ market_status[scope.row.market_status] }}
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
        { slot: 'status' },
        { prop: 'create_user', label: '联系人', minWidth: '90px' },
        { prop: 'create_user', label: '职位', minWidth: '80px' },
        { prop: 'create_user', label: '电话', minWidth: '90px' },
        { prop: 'create_user', label: '邮箱', minWidth: '90px' },
        { prop: 'create_time', label: '邮件语言', minWidth: '80px' },
        { prop: 'operation_data', label: '注册状态', minWidth: '90px' },
        { prop: 'operation_data', label: '注册时间', minWidth: '100px' },
        { prop: 'operation_data', label: '行业', minWidth: '80px' },
        { prop: 'operation_data', label: '国家', minWidth: '90px' },
        { prop: 'operation_data', label: '应收部门邮件', minWidth: '100px' },
        { prop: 'operation_data', label: '负责市场', minWidth: '120px' },
        { prop: 'operation_data', label: '上一次在线时间', minWidth: '100px' }
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
      return document.body.clientHeight - 410 + (this.status ? 0 : 104)
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        if (val.active === 'userInfo') {
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
      market_operation(this.listQuery, '.userInfo').then(res => {
        this.list = res.data.list
        this.total = res.data.data_count
      })
    }
  }
}
</script>

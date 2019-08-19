<template>
  <div>
    <iTable :height="height" :data="data" :col-configs="configs" class="invoiceDetail" row-key="id">
      <el-table-column slot="status" show-overflow-tooltip label="审核状态" align="center" min-width="100px">
        <template slot-scope="scope">
          {{ authorized_status_map[scope.row.authorized_status] }}
        </template>
      </el-table-column>
    </iTable>
  </div>
</template>

<script>
import iTable from '@/components/Table'

export default {
  components: {
    iTable
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      authorized_status_map: {
        '0': '待申请',
        '3': '待审核',
        '4': '已授权'
      },
      configs: [
        { prop: 'relevancy_email', label: '应收部门邮件', minWidth: '90px' },
        { prop: 'contact', label: '联系人', minWidth: '90px' },
        { prop: 'postion', label: '职位', minWidth: '90px' },
        { prop: 'telephone', label: '电话', minWidth: '90px' },
        { prop: 'user_email', label: '邮箱', minWidth: '90px' },
        { prop: 'email_language', label: '邮件语言', minWidth: '80px' },
        { slot: 'status' },
        { prop: 'register_time', label: '授权时间', minWidth: '80px' },
        { prop: 'industry', label: '行业', minWidth: '80px' },
        { prop: 'country', label: '国家', minWidth: '80px' }
      ]
    }
  },
  computed: {
    height() {
      return 40 * (1 + this.data.length)
    }
  }
}
</script>



<template>
  <div>
    <el-tabs v-model="active" type="border-card">
      <el-tab-pane v-if="checkPermission(['group:list:market:upload:supplier'])" :lazy="true" label="导入供应商" name="supplier">
        <upload :post-url="supplier.postUrl" :down-load-url="supplier.downLoadUrl" :list-query="listQuery" @getTable="getTable" />
        <iTable v-if="supplier.list.length>0" :data="supplier.list" :col-configs="supplier.configs" row-key="id" />
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['group:list:market:upload:contact'])" :lazy="true" label="导入联系人" name="contact">
        <upload :post-url="user.postUrl" :down-load-url="user.downLoadUrl" :list-query="listQuery" @getTable="getTable" />
        <iTable v-if="user.list.length>0" :data="user.list" :col-configs="user.configs" row-key="id">
          <el-table-column slot="status" show-overflow-tooltip label="状态">
            <template slot-scope="scope">
              {{ scope.row.status === 0 ? "成功" : "失败" }}
            </template>
          </el-table-column>
        </iTable>
      </el-tab-pane>
      <el-tab-pane v-if="checkPermission(['group:list:market:upload:invoices'])" :lazy="true" label="导入发票" name="invoices">
        <upload :post-url="payablelist.postUrl" :down-load-url="payablelist.downLoadUrl" :list-query="listQuery" @getTable="getTable" />
        <iTable v-if="payablelist.list.length>0" :data="payablelist.list" :col-configs="payablelist.configs" row-key="id">
          <el-table-column slot="status" show-overflow-tooltip label="状态">
            <template slot-scope="scope">
              {{ scope.row.status === 0 ? "成功" : "失败" }}
            </template>
          </el-table-column>
        </iTable>
        <table />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import upload from '@/components/Upload'
import iTable from '@/components/Table'
import checkPermission from '@/utils/permission'
export default {
  components: {
    upload,
    iTable
  },
  props: {
    fCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listQuery: {
        market_id: ''
      },
      supplier: {
        postUrl: '/import/supplier',
        downLoadUrl: `${window.document.location.origin}/upload/supplier.xls`,
        list: [],
        configs: [
          { prop: 'Supplier', label: '供应商' },
          { prop: 'Vendorcode', label: '供应商编码' },
          { prop: 'Email', label: '邮箱' },
          { prop: 'status', label: '状态' },
          { prop: 'line', label: '行数' }
        ]
      },
      user: {
        postUrl: '/import/supplier_user',
        downLoadUrl: `${window.document.location.origin}/upload/user.xls`,
        list: [],
        configs: [
          { prop: 'Vendorcode', label: '供应商编码' },
          { prop: 'Email', label: '邮箱' },
          { prop: 'Contact', label: '联系人' },
          { prop: 'Position', label: '职位' },
          { prop: 'Phone', label: '手机号码' },
          { prop: 'status', label: '状态' },
          { prop: 'line', label: '行数' }
        ]
      },
      payablelist: {
        postUrl: '/import/payment',
        downLoadUrl: `${window.document.location.origin}/upload/payablelist.xls`,
        list: [],
        configs: [
          { prop: 'Vendorcode', label: '供应商编码' },
          { prop: 'InvoiceNo', label: '发票编码' },
          { prop: 'EstPaydate', label: 'EstPaydate' },
          { prop: 'Amount', label: '金额' },
          { prop: 'InvDate', label: '发票日期' },
          { prop: 'status', label: '状态' },
          { prop: 'line', label: '行数' }
        ]
      },
      active: checkPermission(['group:list:market:upload:supplier']) ? 'supplier'
        : checkPermission(['group:list:market:upload:contact']) ? 'contact' : 'invoices'
    }
  },
  created() {
    this.listQuery.market_id = this.fCode
  },
  methods: {
    checkPermission,
    getTable(data) {
      const Arr = []
      data.list.map((v) => {
        if (v.Vendorcode) {
          Arr.push(v)
        }
      })
      if (data.url === '/import/supplier') {
        this.supplier.list = Arr
      }
      if (data.url === '/import/supplier_user') {
        this.user.list = Arr
      }
      if (data.url === '/import/payment') {
        this.payablelist.list = Arr
      }
    }
  }

}
</script>

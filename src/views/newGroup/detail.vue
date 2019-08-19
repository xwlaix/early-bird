<template>
  <div>
    <el-tabs v-model="active" :class="{ active: status }" type="card" class="el-tabs">
      <el-tab-pane
        v-if="checkPermission(['group:list:company:show'])"
        :lazy="true"
        label="公司信息"
        name="company"
      >
        <company :value="value" :status="status" source="show" />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['group:list:contact:show'])"
        :lazy="true"
        label="联系人信息"
        name="contact"
      >
        <contact :value="value" :status="status" source="show" />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['group:list:market:show'])"
        :lazy="true"
        label="市场信息"
        name="market"
      >
        <market :value="value" :status="status" source="show" />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['group:list:extend:show'])"
        :lazy="true"
        label="扩展信息"
        name="extend"
      >
        <extend :value="value" :status="status" :name="name" source="show" />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['group:list:finance:show'])"
        :lazy="true"
        label="运营状况"
        name="finance"
      >
        <finance :value="value" :status="status" source="show" />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(['group:list:finance:show'])"
        :lazy="true"
        label="服务费率"
        name="commission"
      >
        <commission :value="value" :status="status" source="show" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import company from './company'
import contact from './contact'
import market from './market'
import extend from './extend'
import finance from './finance'
import commission from './commission'
import checkPermission from '@/utils/permission' // 权限判断函数
export default {
  components: {
    company,
    contact,
    market,
    extend,
    finance,
    commission
  },
  props: {
    code: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: checkPermission(['group:list:company:show'])
        ? 'company'
        : checkPermission(['group:list:contact:show'])
          ? 'contact'
          : checkPermission(['group:list:market:show'])
            ? 'market'
            : checkPermission(['group:list:extend:show'])
              ? 'extend'
              : 'finance'
    }
  },
  computed: {
    value() {
      return { code: this.code, active: this.active }
    }
  },
  methods: {
    checkPermission
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
  height: calc(100vh - 334px)!important;
  overflow: auto;
}
.el-tabs>>>.el-tabs__content{
  height: calc(100vh - 215px)!important;
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


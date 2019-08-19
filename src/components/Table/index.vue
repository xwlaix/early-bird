<template>
  <div>
    <el-table
      :data="data"
      :show-header="showHeader"
      :border="border"
      :max-height="maxHeight"
      :height="maxHeight"
      :v-loading="loading"
      :class="className"
      v-bind="$attrs"
      :header-cell-style="headerCellStyle"
      style="margin:0 auto;padding:10px 10px; 0"
      size="mini"
      element-loading-text="给我一点时间"
      fit
      highlight-current-row
      v-on="$listeners"
      @current-change="handleChange"
    >
      <div v-for="(colConfig, index) in colConfigs" :key="index">
        <slot v-if="colConfig.slot" :name="colConfig.slot" />
        <component :is="config.component" v-else-if="colConfig.component" :col-config="colConfig" />
        <el-table-column v-else-if="colConfig.numFormat" v-bind="colConfig" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row['currency_sign'] }}{{ numFormat(scope.row[colConfig.prop]) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="colConfig.per" v-bind="colConfig" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row[colConfig.prop] }}%</span>
          </template>
        </el-table-column>
        <el-table-column v-else v-bind="colConfig" :show-overflow-tooltip="true" align="center" />
      </div>
    </el-table>
  </div>
</template>
<script>
import { numFormat } from '@/utils'

export default {
  name: 'ITable',
  props: {
    colConfigs: {
      type: Array,
      default: function() {
        return []
      }
    },
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    headerCellStyle: {
      type: Object,
      default: function() {
        return { background: 'rgb(240,247,255)', color: '#606266' }
      }
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: [String, Number],
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  methods: {
    numFormat,
    handleChange(currentRow) {
      this.$emit('handleChange', currentRow)
    }
  }
}
</script>


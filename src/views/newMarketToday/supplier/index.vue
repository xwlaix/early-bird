<template>
  <div>
    <supplierChart :height="height" :chart-data="chartData" />
    <!-- <supplierTable /> -->
  </div>
</template>

<script>
import supplierChart from './supplierChart'
// import supplierTable from './supplierTable'
import { supplier_scatter_life } from '@/api/marketDetail'

export default {
  name: 'Supplier',
  components: { supplierChart },
  props: {
    code: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chartData: {}
    }
  },
  watch: {
    code() {
      this.getSupplierBarChart()
    }
  },
  mounted() {},
  created() {
    this.getSupplierBarChart()
  },
  methods: {
    getSupplierBarChart() {
      if (!this.code) {
        return false
      }
      supplier_scatter_life({ market_code: this.code }).then(res => {
        this.chartData = res.data
      })
    }
  }
}
</script>


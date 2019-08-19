<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from '@/components/mixins/resize'
// 按需引入 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    setOptions({ outpie, innerpie } = {}) {
      this.chart.setOption({
        backgroundColor: '#0f375f',
        tooltip: {
          confine: true,
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '原因分析',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '45%'],
            center: ['50%', '50%'],
            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: outpie
          },
          {
            name: '原因分析',
            type: 'pie',
            radius: ['60%', '75%'],
            center: ['50%', '50%'],
            label: {
              show: false
            },
            data: innerpie
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    }
  }
}
</script>

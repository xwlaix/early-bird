<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
require('echarts/theme/macarons') // echarts theme
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
        const seriesArr = this.getData(val)
        this.setOptions(val, seriesArr)
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
    getData({ lineData, legendData } = {}) {
      const seriesArr = []
      legendData.map((v, i) => {
        const series = {
          name: '',
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2
              }
            }
          },
          smooth: false,
          type: 'line',
          step: 'middle',
          data: {},
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }
        seriesArr.push(Object.assign(series, { data: lineData[i] }, { name: v }))
      })
      return seriesArr
    },
    setOptions({ legendData, xAxisData } = {}, seriesArr) {
      this.chart.setOption({
        // backgroundColor: '#0f375f',

        xAxis: {
          name: '时间',
          data: xAxisData,
          boundaryGap: false,
          axisTick: {
            show: false,
            symbol: ['arrow', 'arrow']
          },
          axisLine: {
            show: true
          },
          nameTextStyle: {
            fontSize: '12px',
            align: 'left'
          },
          nameGap: 10
        },
        grid: {
          left: 10,
          right: 60,
          bottom: 20,
          top: 60,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          name: '年化率',
          splitLine: { show: false },
          axisTick: {
            show: false
          },
          max: function(value) {
            return value.max + 3
          },
          nameTextStyle: {
            fontSize: '12px',
            verticalAlign: 'bottom'
          },
          nameGap: 10
        },
        legend: {
          data: legendData,
          top: 35,
          textStyle: {
            color: '#ccc'
          }
        },
        series: [...seriesArr]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      const seriesArr = this.getData(this.chartData)
      this.setOptions(this.chartData, seriesArr)
    }
  }
}
</script>

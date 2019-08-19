<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
require('echarts/theme/macarons') // echarts theme
import resize from '@/components/mixins/resize'
// 按需引入 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/chart/pictorialBar')
require('echarts/lib/chart/bar')
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
    getData({ stackData, legendData } = {}) {
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
          stack: '总量',
          areaStyle: {},
          data: {},
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }
        seriesArr.push(Object.assign(series, { data: stackData[i] }, { name: v }))
      })
      return seriesArr
    },
    setOptions({ legendData, stackData, xAxisData } = {}, seriesArr) {
      this.chart.setOption({
        backgroundColor: '#0f375f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        legend: {
          data: legendData,
          top: '3px',
          textStyle: {
            color: '#ccc'
          }
        },
        xAxis: {
          name: '时间',
          boundaryGap: false,
          data: xAxisData,
          axisLine: {
            lineStyle: {
              color: '#008acd'
            }
          },
          nameTextStyle: {
            fontSize: '12px',
            align: 'left'
          },
          nameGap: 10
        },
        grid: {
          left: 10,
          right: 40,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        yAxis: {
          name: '金额',
          splitLine: { show: false },
          nameTextStyle: {
            fontSize: '12px',
            verticalAlign: 'bottom'
          },
          max: function(value) {
            return Math.floor(value.max * 1.1)
          },
          nameGap: 10,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#008acd'
            }
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

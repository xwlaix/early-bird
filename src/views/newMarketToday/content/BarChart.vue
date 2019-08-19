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
    setOptions(data) {
      const category = []
      const supplierBaprData = []
      const supplierDaprData = []
      let groupDapr = ''
      let groupEapr = ''
      if (!data || data.length < 0) {
        return
      }

      Object.values(data).map(v => {
        category.push(v.supplier)
        supplierDaprData.push(v.avg_apr)
        supplierBaprData.push(v.offer_value)
        groupDapr = v.result_apr
        groupEapr = v.expect_apr
      })
      this.chart.setOption({
        // backgroundColor: '#0f375f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b0}<br /> {a0}：{c0}<br />{a1}：{c1}<br />'
        },
        legend: {
          data: ['供应商bapr', '供应商dapr'],
          top: 35,
          textStyle: {
            color: '#ccc'
          }
        },
        xAxis: {
          name: '供应商',
          data: category,
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
          right: 60,
          bottom: 20,
          top: 60,
          containLabel: true
        },
        yAxis: {
          max: function(value) {
            return Math.max(value.max, groupDapr, groupEapr) + 3
          },
          name: '年化率',
          splitLine: { show: false },
          nameTextStyle: {
            fontSize: '12px',
            verticalAlign: 'bottom'
          },
          nameGap: 10,
          axisLine: {
            lineStyle: {
              color: '#008acd'
            }
          }
        },
        series: [{
          name: '供应商bapr',
          type: 'line',
          smooth: true,
          showAllSymbol: true,
          symbol: 'emptyCircle',
          symbolSize: 8,
          data: supplierBaprData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          markLine: {
            symbol: 'circle',
            lineStyle: {
              opacity: 0.4,
              color: 'red'
            },
            label: {
              show: true,
              position: 'start',
              color: 'red',
              formatter: '{b0}：{c0}'
            },
            data: [
              {
                name: '买家eapr',
                yAxis: groupEapr,
                x: '140'
              }
            ]
          }
        },
        {
          name: '供应商dapr',
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            normal: {
              barBorderRadius: 5,
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#14c8d4' },
                  { offset: 1, color: '#43eec6' }
                  // { offset: 0, color: 'rgb(178,23,16)' },
                  // { offset: 1, color: 'rgb(204,149,99)' }
                ]
              )
            }
          },
          data: supplierDaprData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut',
          markLine: {
            symbol: 'circle',
            lineStyle: {
              opacity: 0.4,
              color: 'green'
            },
            label: {
              show: true,
              position: 'middle',
              color: 'green',
              formatter: '{b0}：{c0}'
            },
            data: [
              {
                name: '买家dapr',
                yAxis: groupDapr,
                x: '140'
              }
            ]
          }
        }, {
          name: 'line',
          type: 'bar',
          barGap: '-100%',
          barWidth: 10,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(20,200,212,0.5)' },
                  { offset: 0.2, color: 'rgba(20,200,212,0.2)' },
                  { offset: 1, color: 'rgba(20,200,212,0)' }
                  // { offset: 0, color: 'rgba(178,23,16,0.6)' },
                  // { offset: 0.2, color: 'rgba(178,23,16,0.2)' },
                  // { offset: 1, color: 'rgba(178,23,16,0)' }
                ]
              )
            }
          },
          z: -12,
          data: supplierBaprData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }, {
          name: 'dotted',
          type: 'pictorialBar',
          symbol: 'rect',
          itemStyle: {
            normal: {
              color: '#0f375f'
            }
          },
          symbolRepeat: true,
          symbolSize: [12, 4],
          symbolMargin: 1,
          z: -10,
          data: supplierBaprData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>

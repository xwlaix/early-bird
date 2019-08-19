<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
require('echarts/theme/macarons') // echarts theme
import resize from '@/components/mixins/resize'
// 按需引入 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/scatter')
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
      default: null
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
      if (data.length < 0) {
        return
      }
      const itemStyle = {
        normal: {
          opacity: 0.8,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }

      const sizeFunction = function(x) {
        const y = Math.sqrt(x / 5e7) + 0.1
        return y * 80
      }
      // Schema:
      const schema = [
        { name: 'offer_value', index: 0, text: '开价年化率', unit: '%' },
        { name: 'avg_apr', index: 1, text: '获得年化率', unit: '%' },
        { name: 'clear_amount', index: 2, text: '清算金额', unit: '' },
        { name: 'supplier', index: 3, text: '供应商', unit: '' }
      ]
      const supplier = []
      const timeline = []
      const series0 = []
      for (const [key, value] of Object.entries(data)) {
        value.map(v => {
          supplier.push(v[0])
        })
        timeline.push(key)
      }
      try {
        data[timeline[0]].map(v => {
          series0.push([+v[2], +v[3], +v[4], v[0], timeline[0]])
          // series0.push([+v.offer_value, +v.avg_apr, +v.clear_amount, v.supplier, timeline[0]])
        })
      } catch (error) {
        return
      }
      const suppliers = [...new Set(supplier)]
      const option = {
        baseOption: {
          timeline: {
            axisType: 'category',
            orient: 'vertical',
            autoPlay: true,
            inverse: true,
            playInterval: 2500,
            left: null,
            right: 0,
            top: 20,
            bottom: 20,
            width: 55,
            height: null,
            label: {
              normal: {
                textStyle: {
                  color: '#999'
                }
              },
              emphasis: {
                textStyle: {
                  color: '#fff'
                }
              }
            },
            symbol: 'none',
            lineStyle: {
              color: '#555'
            },
            checkpointStyle: {
              color: '#bbb',
              borderColor: '#777',
              borderWidth: 2
            },
            controlStyle: {
              showNextBtn: false,
              showPrevBtn: false,
              normal: {
                color: '#666',
                borderColor: '#666'
              },
              emphasis: {
                color: '#aaa',
                borderColor: '#aaa'
              }
            },
            data: []
          },
          backgroundColor: '#404a59',
          title: [
            {
              text: timeline[0],
              textAlign: 'center',
              left: '63%',
              top: '55%',
              textStyle: {
                fontSize: 100,
                color: 'rgba(255, 255, 255, 0.7)'
              }
            },
            {
              text: '每个供应商的获得年化率与开价年化率的关系演变',
              left: 'center',
              top: 10,
              textStyle: {
                color: '#aaa',
                fontWeight: 'normal',
                fontSize: 20
              }
            }
          ],
          tooltip: {
            padding: 5,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: function(obj) {
              var value = obj.value
              return (
                schema[3].text +
                '：' +
                value[3] +
                '<br>' +
                schema[1].text +
                '：' +
                value[1] +
                schema[1].unit +
                '<br>' +
                schema[0].text +
                '：' +
                value[0] +
                schema[0].unit +
                '<br>' +
                schema[2].text +
                '：' +
                value[2] +
                '<br>'
              )
            }
          },
          grid: {
            top: 10,
            containLabel: true,
            left: 5,
            right: 50,
            bottom: 10
          },
          xAxis: {
            type: 'value',
            name: '',
            nameGap: 25,
            max: 36,
            nameLocation: 'middle',
            nameTextStyle: {
              fontSize: 18
            },
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#ccc'
              }
            },
            axisLabel: {
              formatter: '{value} %'
            }
          },
          yAxis: {
            type: 'value',
            name: '获得年化率',
            nameTextStyle: {
              color: '#ccc',
              fontSize: 18
            },
            axisLine: {
              lineStyle: {
                color: '#ccc'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value} %'
            },
            max: 36
          },
          visualMap: [
            {
              show: false,
              dimension: 3,
              categories: suppliers,
              calculable: true,
              precision: 0.1,
              textGap: 30,
              textStyle: {
                color: '#ccc'
              },
              inRange: {
                color: (function() {
                  var colors = [
                    '#bcd3bb',
                    '#e88f70',
                    '#edc1a5',
                    '#9dc5c8',
                    '#e1e8c8',
                    '#7b7c68',
                    '#e5b5b5',
                    '#f0b489',
                    '#928ea8',
                    '#bda29a'
                  ]
                  return colors.concat(colors)
                })()
              }
            }
          ],
          series: [
            {
              type: 'scatter',
              itemStyle: itemStyle,
              data: series0,
              symbolSize: function(val) {
                return sizeFunction(val[2])
              }
            }
          ],
          animationDurationUpdate: 1000,
          animationEasingUpdate: 'quinticInOut'
        },
        options: []
      }

      for (const [key, value] of Object.entries(data)) {
        const series = []
        value.map(v => {
          series.push([+v[2], +v[3], +v[4], v[0], key])
        })
        option.baseOption.timeline.data.push(key)
        option.options.push({
          title: {
            show: true,
            text: key + ''
          },
          series: {
            name: key,
            type: 'scatter',
            itemStyle: itemStyle,
            data: series,
            symbolSize: function(val) {
              return sizeFunction(val[2])
            }
          }
        })
      }
      this.chart.setOption(option)
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>

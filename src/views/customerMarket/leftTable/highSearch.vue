<template>
  <el-dialog
    v-el-drag-dialog
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div
      v-for="(value, key) in textArr"
      :key="key"
      style="margin-top:10px;"
    >
      <el-select
        v-model="value.type"
        filterable
        clearable
        placeholder="请选择类型（唯一）"
        size="small"
        style="width: 200px;"
        class="filter-item"
      >
        <el-option
          v-for="item in optionsSelect"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
      <el-select
        v-model="value.judge"
        filterable
        clearable
        placeholder="请选择判断"
        size="small"
        style="width: 120px;"
        class="filter-item"
      >
        <el-option
          v-for="item in optionsValue"
          :key="item.id"
          :value="item.name"
        />
      </el-select>
      <el-input v-show="value.type!=='status'&&value.type!=='time'" v-model.trim="value.value" placeholder="请输入数值" size="small" style="width: 140px;" clearable class="filter-item" />
      <el-select v-show="value.type==='status'" v-model="value.value" filterable clearable placeholder="请选择状态" size="small" style="width:140px" class="filter-item">
        <el-option v-for="item in market_status" :key="item.value" :value="item.value" :label="item.label" />
      </el-select>
      <el-date-picker
        v-show="value.type==='time'"
        v-model="value.value"
        value-format="yyyy-MM-dd"
        style="width:140px"
        size="small"
        type="date"
        placeholder="选择日期"
      />
      <el-button icon="el-icon-delete" type="danger" size="small" @click.prevent="remove(value)" />
      <el-button type="success" size="small" @click="addOne">新增</el-button>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleStatus">取消</el-button>
      <el-button size="small" type="primary" @click="updateData">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
export default {
  directives: { elDragDialog },
  //   props: {
  //   visible: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  data() {
    return {
      textArr: [{

      }],
      market_status: [
        {
          value: '-5',
          label: '市场停用'
        },
        {
          value: '-4',
          label: '未初始化'
        },
        {
          value: '-3',
          label: '无可清算'
        },
        {
          value: '-2',
          label: '资金不足'
        },
        {
          value: '-1',
          label: '买家关闭'
        },
        {
          value: '0',
          label: '次日开市'
        },
        {
          value: '1',
          label: '活跃交易'
        }
      ],
      optionsSelect: [{
        id: 'status',
        name: '市场状态'
      }, {
        id: 'time',
        name: '资金计划时间'
      }, {
        id: 'HK$',
        name: '期望年化率'
      }, {
        id: 'NT$',
        name: '现金池'
      }, {
        id: '€',
        name: '预留比例'
      }, {
        id: 'JPY￥',
        name: '成本年化率'
      }, {
        id: 'number',
        name: '供应商参加数量'
      }],
      optionsValue: [{
        id: '￥',
        name: '等于'
      }, {
        id: '$',
        name: '不等于'
      }, {
        id: 'HK$',
        name: '大于等于'
      }, {
        id: 'NT$',
        name: '小于'
      }],
      text: ''
    }
  },
  methods: {
    handleStatus() {
      this.$emit('handleStatus')
    },
    remove(value) {
      if (this.textArr.length === 1) {
        return
      }
      var index = this.textArr.indexOf(value)
      if (index !== -1) {
        this.textArr.splice(index, 1)
      }
    },
    addOne() {
      this.textArr.push({})
    },
    updateData() {
      console.log(this.textArr)
      // const str = {}
      // this.textArr.map((v, i) => {
      //   const str1 = v.key
      //   const str2 = v.value
      //   str[str1] = str2
      // })
      // this.text = JSON.stringify(str)
      // console.log(this.textArr)
    }
  }
}
</script>

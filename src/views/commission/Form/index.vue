<template>
  <el-form
    :rules="rules"
    :inline="true"
    :model="temp"
    label-position="right"
    class="dialog"
    label-width="4.5rem"
  >
    <el-form-item label="名称" prop="name">
      <el-input v-model.trim="temp.name" clearable placeholder="请填写名称" style="width:330px" />
    </el-form-item>
    <el-form-item label="币种" prop="currency_sign">
      <el-select v-model="temp.currency_sign" class="filter-item currency" style="width:300px">
        <el-option v-for="item in currency_list" :key="item.sign" :label="item.name" :value="item.sign" />
      </el-select>
    </el-form-item>
    <div v-for="(value,key) in textArr" :key="key">
      <el-form-item label="年交易额" style="width:405px">
        <el-input v-model.trim="value.value1" placeholder="起始数值" size="small" style="width:105px" clearable class="filter-item" />
        <el-select v-model="value.type" filterable clearable placeholder="判断类型" size="small" style="width:105px" class="filter-item">
          <el-option v-for="item in optionsSelect" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
        <el-input v-show="value.type==='to'" v-model="value.value2" placeholder="终止数值" size="small" style="width:110px" clearable class="filter-item" />
      </el-form-item>
      <el-form-item label="佣金比例">
        <el-input v-model.trim="value.per" placeholder="请输入佣金比例" size="small" style="width:300px" clearable class="filter-item" />
        <el-button icon="el-icon-delete" type="danger" size="mini" @click.prevent="remove(value)" />
        <el-button icon="el-icon-plus" type="success" size="mini" @click="addOne" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
import { currencyList } from '@/api/market'
export default {
  name: 'Form',
  props: {
    temp: {
      type: Object,
      default: null
    },
    textArr: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currency_list: [],
      optionsSelect: [{
        id: 'to',
        name: '至'
      }, {
        id: 'greater',
        name: '大于等于'
      }],
      rules: {}
    }
  },
  created() {
    currencyList('.currency').then((res) => {
      this.currency_list = res.data
    }).catch((err) => {
      console.log(err)
    })
  },
  mounted() {},
  methods: {
    remove(value) {
      const index = this.textArr.indexOf(value)
      if (index !== -1) {
        this.textArr.splice(index, 1)
        if (this.textArr.length === 0) {
          this.addOne()
        }
      }
    },
    addOne() {
      this.textArr.push({})
    }
  }
}
</script>


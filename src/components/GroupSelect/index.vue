<template>
  <el-select :value="value" size="small" class="filter-item codeArr" filterable clearable placeholder="请选择集团" @input="change($event)">
    <el-option
      v-for="item in codeArr"
      :key="item.code"
      :label="item.name"
      :value="item.code"
    />
  </el-select>
</template>

<script>
import { getGroup } from '@/api/group'

export default {
  name: 'GroupSelect',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      codeArr: []
    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    getGroupList() {
      getGroup('', '.codeArr').then(res => {
        this.codeArr = res.data.list
      })
    },
    change(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<template>
  <el-transfer
    v-model="check"
    class="transfer"
    filterable
    :titles="['市场选择', '应用范围']"
    :format="{
      noChecked: '${total}',
      hasChecked: '${checked}/${total}'
    }"
    :data="data"
    @left-check-change="leftHandleChange"
    @right-check-change="rightHandleChange"
  >
    <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
    <el-select slot="left-footer" v-model="listQuery.type" size="small" filterable class="filter-item" clearable placeholder="请选择筛选类型" @change="handleFilter">
      <el-option
        v-for="item in typeArr"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </el-transfer>
</template>

<script>
export default {
  name: 'Scope',
  props: {},
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `市场 ${i}`
        })
      }
      return data
    }
    return {
      data: generateData(),
      check: [1],
      listQuery: {
        type: ''
      },
      typeArr: [
        {
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '行业'
        }, {
          value: '2',
          label: '集团'
        }, {
          value: '3',
          label: '市场'
        }
      ]
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleFilter() {
      console.log(this.listQuery.type)
    },
    leftHandleChange(value, movedKeys) {
      setTimeout(() => {
        const temp = [...new Set(this.check.concat(movedKeys))]
        this.check = temp
      }, 300)
    },
    rightHandleChange(value, movedKeys) {
      setTimeout(() => {
        if (movedKeys.length > 1) {
          for (let index = 0; index < value.length; index++) {
            const element = value[index]
            const index = this.check.indexOf(element)
            this.check.splice(index, 1)
          }
        } else {
          const index = this.check.indexOf(movedKeys[0])
          this.check.splice(index, 1)
        }
      }, 300)
    }
  }
}
</script>
<style scoped>
.transfer{
  display: table;
}
.transfer>>>.el-transfer-panel:nth-child(1){
  display:table-footer-group;
}
.transfer>>>.el-transfer-panel:nth-child(3){
  display:table-header-group;
}
.transfer >>> .el-transfer__buttons ,.transfer >>> .el-checkbox__input{
  display: none;
}
.transfer >>> .el-transfer-panel__item.el-checkbox .el-checkbox__label{
  display: inline-block;
  padding: 3px;
  line-height: 20px;
}
.transfer >>> .el-transfer-panel {
  width: 100%;
  margin-top: 10px;
}
.transfer >>> .el-transfer-panel__item{
  padding: 2px;
  margin-top: 3px;
  color: #fff;
  border-radius: 3px;
}
.transfer >>>.el-checkbox__input.is-checked + .el-checkbox__label{
  color: #fff;
}
.transfer>>>.el-transfer-panel:nth-child(1) .el-transfer-panel__item{
  background:#ff4949;
}
.transfer>>>.el-transfer-panel:nth-child(3) .el-transfer-panel__item{
  background:#409EFF;
}
.transfer >>> .el-transfer-panel__filter{
  width:50%;
}
.transfer >>> .el-checkbox{
  margin-right:10px;
}
.transfer>>>.el-transfer-panel .el-transfer-panel__footer{
    bottom: 300px;
    right: 18px;
    width:auto;
    left:auto;
    border: none;
}
</style>


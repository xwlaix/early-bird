<template>
  <div class="leftTable">
    <div class="line-filter">
      <el-input
        v-model.trim="listQuery.name"
        placeholder="集团名称"
        size="mini"
        clearable
        class="filter-item name"
        @clear="fetchData"
        @change="fetchData"
        @keyup.enter.native="fetchData"
      >
        <el-select
          slot="prepend"
          v-model="industry"
          filterable
          size="mini"
          class="filter-item-select"
          placeholder="行业"
          style="width:55px;"
          @change="fetchData"
        >
          <el-option
            v-for="item in industryArr"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <el-button
          slot="append"
          size="mini"
          type="primary"
          class="search"
          icon="el-icon-search"
          @click="fetchData"
        />
      </el-input>
      <el-button size="mini" type="primary" class="right-btn" @click="handleAdd">新建</el-button>
    </div>
    <iTable
      ref="table"
      :max-height="height"
      :height="height"
      :data="list.slice((listQuery.page-1)*listQuery.size,listQuery.page*listQuery.size)"
      :show-header="false"
      :col-configs="configs"
      :row-class-name="tableRowClassName"
      highlight-current-row
      class="group_table"
      row-key="id"
      style="padding:0!important;"
      @row-click="handleChange"
    >
      <el-table-column slot="name" show-overflow-tooltip align="left" min-width="140">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="集团名称" placement="left">
            <svg-icon icon-class="build" />
          </el-tooltip>
          {{ scope.row.name }}
          <br>
          <el-tooltip class="item" effect="dark" content="所属国家" placement="left">
            <svg-icon icon-class="earth" />
          </el-tooltip>
          {{ scope.row.country_name }}
        </template>
      </el-table-column>
      <el-table-column slot="status" show-overflow-tooltip align="left">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="激活的市场个数" placement="right">
            <svg-icon icon-class="line-chart" />
          </el-tooltip>
          {{ scope.row.num }}
          <br>
          <el-tooltip class="item" effect="dark" content="所属行业" placement="right">
            <svg-icon icon-class="hang" :class="getClass(scope.row.industry_name)" />
          </el-tooltip>
          <span :class="getClass(scope.row.industry_name)">{{ scope.row.industry_name }}</span>
        </template>
      </el-table-column>
    </iTable>
    <div class="total">搜索结果：{{ total }}条集团信息</div>
    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-size="listQuery.size"
        :total="total"
        background
        small
        prev-text="上页"
        next-text="下页"
        layout="prev,jumper,next,slot "
        @current-change="handleCurrentChange"
      >
        <el-button type="text" class="fisrtPage" @click="jumpPage('1')">首页</el-button>
        <el-button type="text" class="lastPage" @click="jumpPage('0')">末页</el-button>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { get_group, addGroupData } from '@/api/group'
import iTable from '@/components/Table'

export default {
  components: {
    iTable
  },
  data() {
    return {
      height: document.body.clientHeight - 34 - 228,
      code: '',
      industryArr: [],
      industryMap: {
        '商超业': 'supermarket',
        '制造业': 'manufacturing',
        '零售业': 'retail',
        '其他': 'other'
      },
      industry: '',
      list: [],
      configs: [{ slot: 'status' }, { slot: 'name' }],
      total: 0,
      listQuery: {
        industry: '全部',
        name: '',
        page: 1,
        size: 10
      }
    }
  },

  created() {
    this.fetchData()
    this.getIndustryArr()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    handleChange(row) {
      this.$refs.table.$children[0].setCurrentRow(row || this.list[0])
      this.$emit('handleChange', row || this.list[0])
    },
    jumpPage(val) {
      switch (val) {
        case '1': // 跳转到首页
          this.handleCurrentChange(1)
          break
        case '0': // 跳转到末页
          this.handleCurrentChange(Math.ceil(this.total / this.listQuery.size))
          break
      }
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      const num = (this.listQuery.page - 1) * this.listQuery.size
      this.handleChange(this.list[num])
    },
    getClass(val) {
      return this.industryMap[val]
    },
    getIndustryArr() {
      addGroupData(0).then(res => {
        this.industryArr = [...res.data.industrys, { id: '', name: '全部' }]
      })
    },
    handleAdd() {
      this.$emit('handleAdd')
    },
    fetchData() {
      this.listQuery.page = 1
      this.listQuery.size = Math.floor(this.height / 60)
      this.industry === '全部'
        ? (this.listQuery.industry = '')
        : (this.listQuery.industry = this.industry)
      get_group(this.listQuery, '.group_table').then(res => {
        this.list = res.data.list
        this.total = this.list.length
        if (this.total > 0) {
          this.handleChange(this.list[0])
        }
      })
    }
  }
}
</script>
<style scoped>
.filter-item-select >>> .el-input__inner::placeholder,
.filter-item-select >>> .el-input__inner::-webkit-input-placeholder {
  color: #fff !important;
}

</style>

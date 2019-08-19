<template>
  <div class="leftTable">
    <div class="line-filter">
      <el-input
        v-model.trim="listQuery.search_key"
        placeholder="供应商名称/供应商用户邮件/供应商用户名称/供应商参与的市场"
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
      class="leftTable"
      row-key="id"
      style="padding:0!important;"
      @row-click="handleChange"
    >
      <el-table-column slot="name" show-overflow-tooltip align="left" min-width="140">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="供应商名称" placement="left">
            <svg-icon icon-class="build" class="svg_bg" />
          </el-tooltip>
          {{ scope.row.market_name }}
          <br>
          <el-tooltip class="item" effect="dark" content="所属国家" placement="right">
            <svg-icon icon-class="earth" class="svg_bg" />
          </el-tooltip>
          {{ scope.row.country }}
        </template>
      </el-table-column>
      <el-table-column slot="status" show-overflow-tooltip align="left">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="参与的市场个数" placement="right">
            <svg-icon icon-class="line-chart" class="svg_bg" />
          </el-tooltip>
          {{ scope.row.participation_count }}
          <br>
          <el-tooltip class="item" effect="dark" content="所属行业" placement="left">
            <svg-icon icon-class="hang" class="svg_bg" :class="getClass(scope.row.industry_name)" />
          </el-tooltip>
          <span>
            <span :class="getClass(scope.row.industry_name)" />{{ scope.row.industry_name }}

          </span>
        </template>
      </el-table-column>
    </iTable>
    <div class="total">搜索结果：{{ total }}条供应商信息</div>
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
import { addGroupData, get_supplier } from '@/api/group'
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
      industry: '全部',
      industryMap: {
        '商超业': 'supermarket',
        '制造业': 'manufacturing',
        '零售业': 'retail',
        '其他': 'other'
      },
      list: [],
      oldList: [],
      configs: [{ slot: 'status' }, { slot: 'name' }],
      total: 0,
      listQuery: {
        industry: '',
        search_key: '',
        page: 1,
        size: 10,
        is_active: 0
      }
    }
  },
  created() {
    this.fetchData('first')
    this.getIndustryArr()
  },
  methods: {
    getClass(val) {
      return this.industryMap[val]
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'even-row'
      } else {
        return 'odd-row'
      }
    },
    handleChange(row) {
      if (row) {
        this.$refs.table.$children[0].setCurrentRow(row || this.list[0])
        this.$emit('handleChange', row || this.list[0])
      }
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
    getIndustryArr() {
      addGroupData(0).then(res => {
        this.industryArr = [...res.data.industrys, { id: '', name: '全部' }]
      })
    },
    fetchData(first) {
      this.listQuery.size = Math.floor(this.height / 57.5)
      this.industry === '全部' ? this.listQuery.industry = '' : this.listQuery.industry = this.industry
      get_supplier(this.listQuery, '.leftTable').then(res => {
        this.list = res.data
        this.oldList = [...this.list]
        this.total = res.data.length
        if (first === 'first') {
          this.handleChange(this.list[0])
        }
      })
    }
  }
}
</script>
<style scoped>
.filter-item-select>>>.el-input__inner::placeholder,
.filter-item-select>>>.el-input__inner::-webkit-input-placeholder {
    color: #fff!important;
}
</style>


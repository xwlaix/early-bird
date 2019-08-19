<template>
  <div class="leftTable">
    <div class="line-filter">
      <el-input
        v-model.trim="listQuery.search_key"
        placeholder="市场名称/集团/用户/供应商"
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
      <el-button size="mini" type="text" class="right-btn" @click="highSearch">高级</el-button>
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
      <el-table-column slot="name" show-overflow-tooltip align="left">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="市场名称" placement="left">
            <svg-icon icon-class="build" class="svg_bg" />
          </el-tooltip>
          {{ scope.row.market_name }}
          <br>
          <el-tooltip class="item" effect="dark" content="国家地区" placement="right">
            <svg-icon icon-class="line-chart" class="svg_bg" />
          </el-tooltip>
          {{ scope.row.country }}
        </template>
      </el-table-column>
      <el-table-column slot="status" show-overflow-tooltip align="right" width="90">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.paydate!='null'" class="item" effect="dark" content="早付日期">
            <span class="iconWrap">
              <svg-icon icon-class="calendar" class="svg_bg svg" />
              <span class="iconNum">{{ scope.row.paydate|paydateDay }}</span>
            </span>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="参与供应商数量" placement="right">
            <svg-icon icon-class="suppliersPeople" class="svg_bg" />
          </el-tooltip>
          {{ scope.row.participation_count }}
          <br>
          <span :class="getClass(scope.row.industry_name)">{{ scope.row.industry_name }}</span>
        </template>
      </el-table-column>
    </iTable>
    <div class="total">搜索结果：{{ total }}条市场信息</div>
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
    <highSearch
      :visible.sync="dialogFormVisible"
      title="高级搜索"
      @handleStatus="handleStatus"
    />
  </div>
</template>

<script>
import { get_market, addGroupData } from '@/api/group'
import iTable from '@/components/Table'
import highSearch from './highSearch'
import { parseTime } from '@/utils'

export default {
  components: {
    iTable, highSearch
  },
  filters: {
    paydateDay: function(value) {
      if (value !== 'null') {
        return parseTime(`${value} 00:00:00`, '{d}')
      }
    }
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
      configs: [{ slot: 'status' }, { slot: 'name' }],
      total: 0,
      dialogFormVisible: false,
      listQuery: {
        industry: '',
        search_key: '',
        page: 1,
        size: 10,
        is_active: 1
      }
    }
  },
  created() {
    this.fetchData()
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
    getIndustryArr() {
      addGroupData(0).then(res => {
        this.industryArr = [...res.data.industrys, { id: '', name: '全部' }]
      })
    },
    handleStatus() {
      this.dialogFormVisible = !this.dialogFormVisible
    },
    highSearch() {
      this.dialogFormVisible = true
      // this.$router.push(`/group/step`)
    },
    // fetchData() {
    //   this.list = this.oldList.filter(v => {
    //     if (
    //       this.listQuery.industryName &&
    //       v.industry_name === this.listQuery.industryName &&
    //       this.listQuery.industryName !== '全部'
    //     ) {
    //       if (this.listQuery.name && v.name.includes(this.listQuery.name)) {
    //         return v
    //       } else if (!this.listQuery.name) {
    //         return v
    //       }
    //     } else if (this.listQuery.industryName === '全部') {
    //       if (this.listQuery.name && v.name.includes(this.listQuery.name)) {
    //         return v
    //       } else if (!this.listQuery.name) {
    //         return v
    //       }
    //     }
    //   })
    //   this.total = this.list.length
    // },
    fetchData() {
      this.listQuery.page = 1
      this.listQuery.size = Math.floor(this.height / 59)
      this.industry === '全部' ? this.listQuery.industry = '' : this.listQuery.industry = this.industry
      get_market(this.listQuery, '.leftTable').then(res => {
        this.list = res.data
        this.total = res.data.length
        if (this.total > 0) {
          this.handleChange(this.list[0])
        }
      })
    }
  }
}
</script>
<style scoped>
.iconWrap {
  position: relative;
  left:-20px;
}
.svg {
  position: absolute;
  left: -29px;
  font-size: 22px;
}
.iconNum {
  position: absolute;
  left: -25px;
  top: 1px;
  font-size: 10px;
  color:#F56C6C;
}
.filter-item-select>>>.el-input__inner::placeholder,
.filter-item-select>>>.el-input__inner::-webkit-input-placeholder {
    color: #fff!important;
}
</style>

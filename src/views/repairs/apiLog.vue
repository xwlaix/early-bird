<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.api_name" size="small" style="width: 180px;" clearable class="filter-item" placeholder="请输入接口名称" @clear="handleFilter" />
      <el-input v-model.trim="listQuery.user_name" size="small" style="width: 180px;" clearable class="filter-item" placeholder="请输入登陆用户" @clear="handleFilter" />
      <el-input v-model.trim="listQuery.user_ip" size="small" style="width: 180px;" clearable class="filter-item" placeholder="请输入请求ip地址" @clear="handleFilter" />
      <el-date-picker
        v-model="time"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="~"
        start-placeholder="选择请求发起开始日期"
        unlink-panels
        end-placeholder="请求发起结束日期"
        class="filter-item"
        size="small"
      />
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter" />
      <el-button class="filter-item " size="small" type="success" icon="el-icon-refresh" @click="handleRefresh" />
    </div>
    <iTable
      :data="list"
      :col-configs="configs"
      :height="height"
      :max-height="height"
      class="apilLog"
      row-key="id"
    >
      <el-table-column slot="api_content" show-overflow-tooltip label="请求参数" min-width="160px" align="center">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.api_content" trigger="hover" placement="top">
            <el-table :data="getValue(scope.row,'api_content')" size="mini">
              <el-table-column
                v-for="(item, index) in getLabel(scope.row,'api_content')"
                :key="index"
                :label="item"
                show-overflow-tooltip
                width="150"
                align="center"
              >
                <template slot-scope="scopeSecond">
                  <span>{{ scopeSecond.row[item] }}</span>
                </template>
              </el-table-column>

            </el-table>
            <div slot="reference">
              <el-tag size="medium">数据详情</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column slot="return_content" show-overflow-tooltip label="请求返回" min-width="160px" align="center">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.return_content" trigger="hover" placement="top">
            <el-table :data="getValue(scope.row,'return_content')" fit size="mini">
              <el-table-column
                v-for="(item, index) in getLabel(scope.row,'return_content')"
                :key="index"
                :label="item"
                show-overflow-tooltip
                width="250"
                align="center"
              >
                <template slot-scope="scopeSecond">
                  <!-- :type="typeof getValue(scope.row,'return_content')[0][item] ==='object'?'expand':''" -->
                  {{ scopeSecond.row[item] }}
                  <!-- <span v-if="typeof scopeSecond.row[item] !=='object'">{{ scopeSecond.row[item] }}</span>
                  <el-table v-else :data="[scopeSecond.row[item]]" fit size="mini">
                    <el-table-column
                      v-for="(val, key) in scopeSecond.row[item]"
                      :key="key"
                      :label="key"
                      :type="typeof val ==='object'?'expand':''"
                      show-overflow-tooltip
                      align="center"
                    >
                      <template>
                        {{ val }}
                        <span v-if="typeof val !=='object'">{{ val }}</span>
                        <el-table v-else :data="val" fit size="mini">
                          <el-table-column
                            v-for="(item1, index1) in getLabel(scopeSecond.row,item)"
                            :key="index1"
                            :label="item1"
                            show-overflow-tooltip
                            width="150"
                            align="center"
                          >
                            <template>
                              <span>{{ item1 }}{{ index1 }}</span>
                            </template>
                          </el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>
                  </el-table> -->
                </template>
              </el-table-column>

            </el-table>
            <div slot="reference">
              <el-tag size="medium">数据详情</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </iTable>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { api_record } from '@/api/apiLog'
import iTable from '@/components/Table'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ApiLog',
  components: {
    iTable,
    Pagination
  },
  data() {
    return {
      height: document.body.clientHeight - 34 - 220,
      list: [],
      configs: [
        { slot: 'return_content' },
        { prop: 'name', label: '接口名称', minWidth: '180px' },
        { prop: 'user_name', label: '登陆用户', minWidth: '140px' },
        { prop: 'ip', label: '请求ip地址', minWidth: '120px' },
        { prop: 'host', label: '请求来源地址', minWidth: '120px' },
        { prop: 'create_time', label: '请求发起时间', minWidth: '140px' },
        { prop: 'return_time', label: '请求返回时间', minWidth: '140px' },
        { slot: 'api_content' }
      ],
      total: 0,
      time: '',
      listQuery: {
        page: 1,
        size: 2,
        api_name: '',
        user_name: '',
        user_ip: '',
        start_time: '',
        end_time: ''
      },
      temp: {

      }
    }
  },
  watch: {
    time(val) {
      if (val) {
        this.listQuery.start_time = val[0]
        this.listQuery.end_time = val[1]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getLabel(row, type) {
      const keyArr = []
      if (row[type] && row[type] !== 'null') {
        keyArr.push(Object.keys(this.toJson(row[type])))
      }
      return Array.from(new Set(keyArr.flat()))
    },
    getValue(row, type) {
      const dataArr = []
      if (row[type] && row[type] !== 'null') {
        dataArr.push(this.toJson(row[type]))
      }
      return dataArr
    },
    toJson(row) {
      if (row) {
        return JSON.parse(row)
      } else {
        return {}
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleRefresh() {
      this.listQuery = {
        page: 1,
        size: 10,
        api_name: '',
        user_name: '',
        user_ip: '',
        start_time: '',
        end_time: ''
      }
      this.time = []
      this.fetchData()
    },
    fetchData() {
      api_record(this.listQuery, '.apilLog').then(res => {
        this.list = res.data.list
        this.total = res.data.data_count
      })
    }
  }
}
</script>

<template>
  <div v-loading="loading" class="app-container">
    <div class="filter-container">
      <el-select v-model="parameters.country" size="small" filterable clearable placeholder="请选择所属国家地区">
        <el-option
          v-for="(item,index) in options"
          :key="index"
          :value="index.toLowerCase()"
          :label="item"
        />
      </el-select>
      <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter" />
    </div>
    <el-calendar v-if="show" v-model="value">
      <template
        slot="dateCell"
        slot-scope="{date, data}"
      >
        <span :class="getSlelected(data.day) ? 'rest' : ''">{{ getSlelected(data.day) ? '休' : '' }}</span>
        <el-tooltip :content="getContent(data)" class="item" effect="dark" placement="top-start" @dblclick.native="setDate(data.day)">
          <div :class="classObject(data)">
            <p class="day">
              {{ data.day.split('-').slice(2).join() }}
            </p>
            <p :class="getHolidayClass(data) ? 'holiday' : ''" class="lunarCalendar day">{{ getText(data) }}</p>
          </div>
        </el-tooltip>

      </template>
    </el-calendar>
    <div class="filter-container foot-container">
      <el-button type="info" size="small" style="margin-right:35px;" @click="clearData">重置</el-button>
      <el-button v-permission="['setting:calendar:update']" type="primary" size="small" @click="updateData">保存</el-button>
    </div>
  </div>
</template>
<script>

import { getYear, getHoliday, calenarList, calenarUpdate } from '@/api/holiday'
import Calendarific from 'calendarific'
import location from '@/assets/zh.json'
import { parseTime } from '@/utils'

export default {
  name: 'SettingCalendar',
  data() {
    return {
      value: '',
      month: '',
      isSelected: [],
      isDelete: [],
      holiday: {},
      year: {},
      calendarifi: {},
      options: location.countries,
      show: false,
      showStauts: '',
      loading: false,
      parameters: {
        country: 'cn',
        year: 2019
      }
    }
  },
  computed: {
    clapi() {
      return new Calendarific('b100b7115dcca435249f5a2c4a019334008128ca')
    },
    showYear() {
      return +parseTime(this.value, '{y}') || (new Date()).getFullYear()
    }
  },
  watch: {
    showYear() {
      this.parameters.year = this.showYear
      this.getCalendarific()
    }
  },
  created() {
    // this.getHolidayList()
    // this.getCalendarific()
    this.getYearList()
    this.getCalenarList()
  },
  methods: {
    handleFilter() {
      this.getCalendarific()
    },
    getCalenarList() {
      calenarList({ year: this.showYear, status: 3 }).then(res => {
        this.isSelected = Object.keys(res.data)
      })
    },
    getCalendarific() {
      if (this.parameters.country !== 'cn') {
        this.show = false
        this.loading = true
        this.clapi.holidays(this.parameters, (data) => {
          this.calendarifi[this.showYear] = data.response.holidays
          this.show = true
          this.loading = false
          this.showStauts = 'other'
        })
      } else {
        this.getYearList(this.showYear)
      }
    },
    getYearList(year) {
      this.loading = true
      getYear(year, '.app-container').then(res => {
        this.year[this.showYear] = res.data
        this.showStauts = 'complex'
        setTimeout(() => {
          this.show = true
          this.loading = false
        }, 1500)
      }).catch(() => {
        this.getHolidayList(year)
        this.showStauts = 'simple'
        this.show = true
        this.loading = false
      })
    },
    getHolidayList(year) {
      getHoliday(year, '.app-container').then(res => {
        this.holiday[this.showYear] = res.holiday
      })
    },

    getComplex(data) {
      const date = data.day.split('-')
      const year = date[0]
      const month = date[1] - 1
      const day = date[2] - 1
      try {
        return this.year[year] ? this.year[year][month].days[day] : ''
      } catch (error) {
        console.log(error)
      }
    },
    getSimple(data) {
      const date = data.day.split('-')
      const year = date[0]
      try {
        return this.holiday[year][data.day.split('-').slice(1).join('-')]
      } catch (error) {
        console.log(error)
      }
    },
    getOther(data) {
      const date = data.day.split('-')
      const year = date[0]
      const month = date[1]
      const day = date[2]
      try {
        return this.calendarifi[year].find((v, i) => {
          const type = v.type.length > 0 ? v.type : []
          return +v.date.datetime.year === +year && +v.date.datetime.month === +month && +v.date.datetime.day === +day && type.includes('National holiday')
        })
      } catch (error) {
        console.log(error)
      }
    },
    getText(data) {
      if (this.showStauts === 'simple') {
        const holiday = this.getSimple(data)
        return holiday ? holiday.name : ''
      } else if (this.showStauts === 'complex') {
        const item = this.getComplex(data)
        if (item.type !== 0) {
          return item.typeDes
        } else {
          return item.lunarCalendar
        }
      } else {
        const item = this.getOther(data)

        return item ? item.name : data.day.split('-').slice(0, 2).join('-')
      }
    },
    classObject(data) {
      return {
        'pass': this.checkPass(data.day)
      }
    },
    checkPass(day) {
      const d = new Date(day)
      const now = Date.now()
      return (now - d) > 0
    },
    getSlelected(day) {
      return this.isSelected.includes(day)
    },
    getContent(data) {
      if (this.showStauts === 'simple') {
        const holiday = this.getSimple(data)
        return holiday ? holiday.name : data.day
      } else if (this.showStauts === 'complex') {
        const item = this.getComplex(data)
        return `${item.typeDes}--${item.solarTerms}--${item.lunarCalendar}`
      } else {
        const item = this.getOther(data)
        return item
          ? `${item.name || ''}；
          ${item.description || ''}；
        ${item.type.length > 0 ? item.type.join(',') : ''}` : data.day
      }
    },
    getHolidayClass(data) {
      if (this.showStauts === 'simple') {
        const holiday = this.getSimple(data)
        return holiday ? holiday.holiday : false
      } else if (this.showStauts === 'complex') {
        const item = this.getComplex(data)
        if (item.type !== 0) {
          return true
        } else {
          return false
        }
      } else {
        if (this.getOther(data)) {
          return true
        } else {
          return false
        }
      }
    },
    getMonthTime() {
      const nowDate = this.value ? new Date(this.value) : new Date()
      this.month = nowDate.getMonth() + 1
      this.month = nowDate.getMonth() + 1 > 9 ? nowDate.getMonth() + 1 : '0' + (nowDate.getMonth() + 1)
      const nowYear = nowDate.getFullYear()
      const temp = [...this.isSelected]
      temp.map((v, i) => {
        const date = v.split('-')
        const year = date[0]
        const month = date[1]
        if (+nowYear === +year && +month === +this.month) {
          this.isDelete.push(v)
        }
      })
      this.isDelete.map((v, i) => {
        if (this.isSelected.includes(v)) {
          const index = this.isSelected.indexOf(v)
          this.isSelected.splice(index, 1)
        }
      })
    },
    clearData() {
      this.$confirm(
        `此操作将会重置未来的当月日期为开市状态, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.getMonthTime()
          console.log(this.isSelected)
          console.log(this.isDelete)
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '已取消',
            duration: 2000
          })
        })
    },
    updateData() {
      const service_status_3 = {}
      const service_status_1 = {}
      this.isSelected.map((item) => {
        service_status_3[item] = 3
      })
      this.isDelete.map((item) => {
        service_status_1[item] = 0
      })
      const service_status = Object.assign(service_status_3, service_status_1)
      calenarUpdate(service_status).then(res => {
        this.$notify({
          type: res.code !== 200 ? 'danger' : 'success',
          message: res.msg,
          duration: 2000
        })
      })
    },
    setDate(day) {
      if (!this.checkPass(day)) {
        if (this.isSelected.includes(day)) {
          const index = this.isSelected.indexOf(day)
          this.isSelected.splice(index, 1)
          this.isDelete.push(day)
        } else if (this.isDelete.includes(day)) {
          const index = this.isSelected.indexOf(day)
          this.isDelete.splice(index, 1)
          this.isSelected.push(day)
        } else {
          this.isSelected.push(day)
        }
      } else {
        this.$notify({
          type: 'info',
          message: '过去的日期无法操作！',
          duration: 2000
        })
      }
    }
  }
}
</script>
<style>
  .rest {
    position: absolute;
    display: inline-block;
    color: #fff;
    background: rgb(253,59,52);
    padding: 5px;
  }
  .day{
    text-align: center;
    line-height: 27px;
    margin: 0 auto;
    color:rgb(49,113,174);
    font-size:24px;
  }
  .lunarCalendar{
    color: #969799;
    font-size: 16px;
    white-space: nowrap;
    text-overflow : ellipsis;
    overflow: hidden;
  }
  .holiday{
    color:rgb(253,59,52);
  }
  .pass{
    background-color: rgb(244,244,244);
  }
  .foot-container{
    text-align:center;
    padding-top:0px;
    padding-bottom:0px;
    margin-bottom: 40px;
  }
  .app-container{
    padding-bottom: 0;
  }
  .el-calendar-table .el-calendar-day {
    height: 70px;
  }
</style>

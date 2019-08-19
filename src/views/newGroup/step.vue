<template>
  <div class="app-container">
    <div class="step-container">
      <el-steps :active="active" finish-status="success" simple>
        <el-step title="基础资料" />
        <el-step title="联系人" />
        <el-step title="运营状况" />
        <el-step title="公司资料" />
        <el-step title="市场资料" />
      </el-steps>
    </div>
    <div class="filter-container">
      <GroupForm v-if="active===0" ref="group" :temp="group.temp" :select-temp="group.selectTemp" />
      <contact v-if="active===1" ref="contact" :value="value" source="step" />
      <finance v-if="active===2" ref="finance" :value="value" source="step" />
      <company v-if="active===3" ref="company" :value="value" source="step" />
      <market v-if="active===4" ref="market" :value="value" source="step" />
    </div>
    <div class="foot-container">
      <el-button size="small" type="info" style="margin:0 15px;vertical-align: baseline;" class="filter-item " @click="getActive(-1)">上一步</el-button>
      <el-button size="small" type="primary" style="margin:0 15px;vertical-align: baseline;" class="filter-item " @click="getActive(1)">{{ active===4?'完成':'下一步' }}</el-button>
    </div>
    <el-button v-if="active>0&&active<4" size="small" type="primary" class="filter-item save" @click="handSave()">保存退出</el-button>
  </div>
</template>

<script>
import { addGroupData, createGroup, updateGroup } from '@/api/group'
import GroupForm from './form'
import finance from './finance'
import contact from './contact'
import company from './company'
import market from './market'

export default {
  components: { GroupForm, contact, finance, company, market },
  data() {
    return {
      active: 0,
      loading: {
        group: '',
        contact: '',
        finance: '',
        company: '',
        market: ''
      },
      code: this.$route.query.group_code,
      total: {
        contact: 0,
        company: 0,
        market: 0
      },
      group: {
        selectTemp: {},
        temp: {
          f_code: ''
        }
      }
    }
  },
  computed: {
    value() {
      return { code: this.group.temp.f_code, active: this.active }
    }
  },
  created() {
    this.getGroupData(0)
  },
  methods: {
    handSave() {
      this.$emit('handDone', 'save')
    },
    getTotal(type, total) {
      if (type === 'contact') {
        this.total.contact = total
      } else if (type === 'company') {
        this.total.company = total
      } else if (type === 'market') {
        this.total.market = total
      }
    },
    getGroupData(code, type) {
      addGroupData(code, '.foot-container').then(res => {
        this.group.selectTemp = Object.assign({}, res.data)
        const tempObject = {}
        if (code) {
          Object.keys(res.data.info).forEach((key) => {
            tempObject['f_' + key] = res.data.info[key]
          })
          this.group.temp = Object.assign({}, tempObject)
          this.jump(type)
        }
      })
    },
    handleGroup(type) {
      this.$refs['group'].$children[0].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.group.temp)
          if (!tempData.f_code) {
            delete tempData.f_code
            createGroup(tempData, '.foot-container').then((res) => {
              this.getGroupData(res.data.code, type)
            })
          } else {
            updateGroup(tempData, '.foot-container').then((res) => {
              this.getGroupData(res.data.code, type)
            })
          }
        }
      })
    },
    handleContact(type) {
      if (this.total.contact <= 0) {
        this.$notify({
          type: 'error',
          message: '请最少添加一个联系人！',
          duration: 2000
        })
      } else {
        this.jump(type)
      }
    },
    handleFinance() {
      this.$refs.finance.order()
    },
    handleCompany(type) {
      if (this.total.company <= 0) {
        this.$notify({
          type: 'error',
          message: '请最少添加一个公司！',
          duration: 2000
        })
      } else {
        this.jump(type)
      }
    },
    handleMarket(type) {
      if (this.total.market <= 0) {
        this.$notify({
          type: 'error',
          message: '请最少添加一个市场！',
          duration: 2000
        })
      } else {
        this.jump(type)
      }
    },
    jump(type) {
      const active = this.active + type
      if (active > 4) {
        this.$emit('handDone', 'done')
      } else if (active < 0) {
        return
      } else {
        this.$emit('handDone', 'first')
      }
      this.active = active
      if (this.active === 0) {
        this.$nextTick(() => {
          this.$refs.group.setAddress()
        })
      }
    },
    getActive(type) {
      switch (this.active) {
        case 0:
          type > 0 ? this.handleGroup(type) : this.$refs['group'].$children[0].clearValidate()
          break
        case 1:
          type > 0 ? this.handleContact(type) : this.jump(type)
          break
        case 2:
          type > 0 ? this.handleFinance() : this.jump(type)
          break
        case 3:
          type > 0 ? this.handleCompany(type) : this.jump(type)
          break
        case 4:
          type > 0 ? this.handleMarket(type) : this.jump(type)
          break
        default:
          break
      }
    }
  }
}
</script>
<style scoped>
.save{
  margin:30px -20px;
  vertical-align: baseline;
  float: right;
}
.step-container{
  margin-bottom: 10px;
}
.foot-container{
  position: absolute;
  left: 50%;
  bottom: 0px;
  height: 50px;
  transform: translate(-50%, -50%);
}
.step-container>>>.el-steps--simple{
  background:#fff!important;
  margin-bottom: 20px;
}
.app-main{
  min-height: calc(100vh - 34px - 50px)!important;
  padding: 20px 20px 0 20px;
}
.filter-container{
  height: calc(100vh - 34px - 240px);
  margin-bottom:0;
}

@media screen and (max-width: 860px) {
  .app-main{
    min-height: calc(100% - 100px)!important;
  }
  .filter-container{
    height: calc(100% - 290px)!important;
  }
  .foot-container{
    top: calc(100% + 50px);
  }
}
</style>



<template>
  <div class="baseInfo group_container">
    <span class="handle">
      <el-button type="text" @click="handleUpdate">
        <svg-icon icon-class="form" />
      </el-button>
      <el-button type="text" @click="changeStatus">
        <i v-show="!status" class="el-icon-back" />
        <i v-show="status" class="el-icon-right" />
      </el-button>
    </span>
    <el-card :class="{ active: status }" class="second-card">
      <div slot="header" class="clearfix header">
        <!-- <span class="title">{{ data.name }} 基础资料</span>
        <span class="handle">
          <el-button type="text" @click="changeStatus">{{ status?'折叠':'展开' }}</el-button>
          <el-button type="text" @click="handleUpdate">
            <svg-icon icon-class="form" />
          </el-button>
        </span> -->
      </div>
      <div v-show="status" class="left">
        <ul class="flow-ul l sms-ul">
          <li>
            <span class="one">集团名称：</span>
            <span> {{ data.name }}</span>
          </li>
          <li>
            <span class="two">集团总机：</span>
            {{ data.contact_phone }}
          </li>
          <li>
            <span class="three">财年截止时间：</span>
            {{ data.fiscal_month }}月最后一日
          </li>
          <li>
            <span class="one">集团网址：</span>
            {{ data.web_site }}
          </li>
          <li>
            <span class="two">所属国家地区：</span>
            {{ data.country }}
          </li>
          <li>
            <span class="three">所属销售：</span>
            {{ seller }}
          </li>
          <li>
            <span class="one">集团类型：</span>
            {{ type }}
          </li>
          <li>
            <span class="two">{{ data.province?'所属省份：':'集团城市：' }}</span>
            {{ data.province||data.city }}
          </li>
          <li />
          <li>
            <span class="one">所属行业：</span>
            {{ industry }}
          </li>
          <li v-if="data.province">
            <span class="two">集团城市：</span>
            {{ data.city }}
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addGroupData } from '@/api/group'
import { seller_list } from '@/api/group'

export default {
  props: {
    code: {
      type: String,
      default: ''
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      data: {},
      sellerArr: [],
      industry: '',
      seller: '',
      type: ''
    }
  },
  computed: {
    change() {
      return { code: this.code, status: this.status }
    }
  },
  watch: {
    change() {
      this.getData()
    }
  },
  created() {
    seller_list().then(res => {
      this.sellerArr = [...res.data]
    })
    if (this.code) {
      this.getData()
    }
  },
  methods: {
    changeStatus() {
      this.$emit('changeStatus')
    },
    handleUpdate() {
      this.$emit('handleUpdate')
    },
    getData() {
      if (this.status && this.code) {
        addGroupData(this.code, '.baseInfo').then(res => {
          this.data = Object.assign({}, res.data.info)
          const industrys = [...res.data.industrys]
          const types = [...res.data.types]
          industrys.find((v) => {
            if (v.id === res.data.info.industry_id) {
              this.industry = v.name
            }
          })
          types.find((v) => {
            if (v.id === res.data.info.type_id) {
              this.type = v.name
            }
          })
          this.sellerArr.find((v) => {
            if (v.id === res.data.info.seller_id) {
              this.seller = v.username
            }
          })
        })
      } else {
        this.data.name = ''
      }
    }
  }
}
</script>
<style scoped>
.baseInfoControl{
  position: absolute;
  right: 20px;
  top:0;
}
.baseInfoControl>>>.el-button--text{
  color: #fff!important;
}
.second-card>>>.el-card__body{
  padding: 0!important;
  background: #fff!important;
}
.active.second-card>>>.el-card__body{
  padding: 5px!important;
}
.handle{
  right:15px;
}
/* .image {
  width: 110px;
  line-height: 110px;
  float: left;
} */

</style>


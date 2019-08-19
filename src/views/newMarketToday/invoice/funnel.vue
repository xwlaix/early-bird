<template>
  <div
    class="handlePay"
    :style="handlePay"
  >
    <div class="title">发票漏斗</div>
    <div class="valid">有效应付</div>
    <div class="validValue">{{ temp.valid }}%</div>
    <div class="validDetail">
      <el-button size="mini" type="success" class="filter-item" @click="changeType('is_offered')">查看详情</el-button>
    </div>
    <div class="offer">开价应付</div>
    <div class="offerValue">{{ temp.offer }}%</div>
    <div class="offerDetail">
      <el-button size="mini" type="success" class="filter-item" @click="changeType('is_included')">查看详情</el-button>
    </div>
    <div class="includes">包括应付</div>
    <div class="includesValue">{{ temp.include }}%</div>
    <div class="includesDetail">
      <el-button size="mini" type="success" class="filter-item" @click="changeType('is_awarded')">查看详情</el-button>
    </div>
    <div class="pick">选中应付</div>
  </div>
</template>

<script>
import handlePayPng from '@/assets/image/funnel.png'

export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      height: document.body.clientHeight - 265 - 82,
      handlePay: {
        backgroundImage: 'url(' + handlePayPng + ')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 5px '
      },
      temp: {
        include: '',
        offer: '',
        valid: ''
      }
    }
  },
  watch: {
    data() {
      this.getTemp()
    }
  },
  created() {
    this.handlePay.backgroundSize = `100%`
  },
  methods: {
    getTemp() {
      this.temp.include = this.data.include.percent
      this.temp.offer = this.data.offer.percent
      this.temp.valid = this.data.valid.percent
    },
    changeType(type) {
      this.$emit('changeType', type)
    }
  }
}
</script>
<style scoped>
.handlePay {
  background-size: 100% 292px!important;
  height: calc(100vh - 347px);
  text-align: center;
  position: relative;
    margin:0 auto;
  transform:translate(0,25%);
}
.title{
  display: inline-block;
  position: absolute;
  top: -29px;
  border-radius: 5px;
  font-size: 20px;
  padding: 5px;
  background: #000;
  color: #fff;
  left:50%;
  transform:translate(-50%,0);
}
.valid {
  padding: 5px;
  background: #fff;
  position: absolute;
  top: 4px;
  color: #67c23a;
  left:50%;
  transform:translate(-50%,0);
}
.validValue {
  position: absolute;
  top: 31.5px;
  left:50%;
  transform:translate(-50%,0);
}
.validDetail {
  position: absolute;
  top: 57px;
  left:50%;
  transform:translate(-50%,0);
}
.offer {
  position: absolute;
  top: 95px;
  color: #409eff;
  left:50%;
  transform:translate(-50%,0);
}
.offerValue {
  position: absolute;
  top: 123px;
  left:50%;
  transform:translate(-50%,0);
}
.offerDetail {
  position: absolute;
  top: 149px;
  left:50%;
  transform:translate(-50%,0);
}
.includes {
  position: absolute;
  top: 192px;
  color: #e6a23c;
  left:50%;
  transform:translate(-50%,0);
}
.includesValue {
  position: absolute;
  top: 219.5px;
  left:50%;
  transform:translate(-50%,0);
}
.includesDetail {
  position: absolute;
  top: 240px;
  left:50%;
  transform:translate(-50%,0);
}
.pick {
  position: absolute;
  top: 276px;
  color: #f56c6c;
  left:50%;
  transform:translate(-50%,0);
}

</style>


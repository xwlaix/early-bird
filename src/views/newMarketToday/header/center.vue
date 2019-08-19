<template>
  <div class="warp">
    <div class="headerTitle">
      <el-tooltip class="item" effect="dark" content="期望年化率" placement="top">
        <div
          class="leftHeader"
          :style="leftHeader"
        >
          {{ headerTitle.expect_apr }}%
        </div>
      </el-tooltip>

      <div
        class="centerHeader"
        :style="centerHeader"
      >
        <span>
          {{ headerTitle.market_name }}
        </span>
        <br>
        <el-tooltip class="item" effect="dark" content="现金池" placement="right">
          <span>
            {{ reserve_amount }}
          </span>
        </el-tooltip>
      </div>
      <el-tooltip class="item" effect="dark" content="预留比例" placement="top">
        <div
          class="rightHeader"
          :style="rightHeader"
        >{{ headerTitle.reserve_percent }}%<span style="margin-left:10px;">{{ reserve_amount }}</span></div>
      </el-tooltip>

    </div>

  </div>
</template>
<script>
import leftHeaderPng from '@/assets/image/leftHeader.png'
import centerHeaderPng from '@/assets/image/centerHeader.png'
import rightHeaderPng from '@/assets/image/rightHeader.png'

export default {
  props: {
    headerTitle: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      leftHeader: {
        backgroundImage: 'url(' + leftHeaderPng + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '184px 30px'
      },
      centerHeader: {
        backgroundImage: 'url(' + centerHeaderPng + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '300px 55px'
      },
      rightHeader: {
        backgroundImage: 'url(' + rightHeaderPng + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '184px 30px' }
    }
  },
  computed: {
    reserve_amount() {
      if (this.headerTitle.reserve_amount) {
        return (+this.headerTitle.reserve_amount).toFixed(2)
      } else {
        return 0.00
      }
    },
    percentage() {
      if (this.headerTitle.clear_amount && +this.headerTitle.clear_amount !== 0) {
        return +((this.headerTitle.valid_amount / this.headerTitle.clear_amount) * 100).toFixed(2)
      } else {
        return 0.00
      }
    }
  }
}
</script>
<style scoped>

.headerTitle {
  position: relative;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
}
.leftHeader {
  display: inline-block;
  width: 184px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  margin-left: calc(50% - 300px);
}
.centerHeader {
  position: absolute;
  left: 140px;
  text-align: center;
  width: 300px;
  height: 55px;
  /* top: 1px; */
  z-index: 100;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.centerHeader span{
  display: inline-block;
}
.centerHeader span:nth-of-type(1){
  margin-top:15px;
}
.centerHeader span:nth-of-type(2){
  font-size: 12px;
}
.rightHeader {
  position: absolute;
  z-index: 0;
  display: inline-block;
  width: 184px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  text-align: center;
   top: 50%;
  left: calc(50% + 200px);
  transform: translate(-50%, -50%);
}
</style>


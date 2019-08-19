<template>
  <div class="main">
    <!-- <div class="block">
      <span class="demonstration">scale</span>
      <el-slider v-model="scale" :max="10" />
    </div>
    <div class="block">
      <span class="demonstration">width</span>
      <el-slider v-model="width" :max="3000" show-input />
    </div> -->
    <div id="pdf">
      <div id="partOne">
        <div class="one">
          <img :src="logo" fit="scale-down" class="logo" alt>
          <div class="right">
            <div class="bold">{{ map[data.area]['company'] }}</div>
            <div>{{ map[data.area]['detail'] }}</div>
            <div>{{ map[data.area]['street'] }}</div>
            <div>{{ map[data.area]['area'] }}</div>
          </div>
        </div>
        <hr>
        <div class="two">
          <el-row :gutter="20">
            <el-col :span="12" class="left">
              <div>{{ map[data.area]['to'] }}：{{ data.name }}</div>
              <div>{{ data.address }}</div>
              <div>{{ map[data.area]['contact'] }}：{{ data.contact }}</div>
              <div>{{ data.email }}</div>
            </el-col>
            <el-col :span="12" class="right">
              <div class="title">{{ map[data.area]['invoice'] }}</div>
              <div class="list">
                {{ map[data.area]['invoiceCode'] }}：
                <span>{{ data.invoiceCode }}</span>
              </div>
              <div class="list">
                {{ map[data.area]['issueDate'] }}：
                <span>{{ data.issueDate }}</span>
              </div>
              <div class="list">
                {{ map[data.area]['totalAmount'] }}：
                <span>{{ data.totalAmount }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="three">
          <div>
            {{ map[data.area]['forPeriod'] }}：
            <span>{{ data.forPeriod }}</span>
          </div>
          <div>
            {{ map[data.area]['periodDiscountAmount'] }}：
            <span>{{ data.periodDiscountAmount }}</span>
          </div>
          <div>
            {{ map[data.area]['serviceRateApplied'] }}：
            <span>{{ data.serviceRateApplied }}</span>
          </div>
        </div>
      </div>
      <div id="partTwo">
        <div class="four">
          <table class="laoye-table" border="1" cellspacing="10" cellpadding="10">
            <tr>
              <td />
              <td>{{ map[data.area]['amount'] }}({{ data.amount }})</td>
            </tr>
            <tr>
              <td>{{ map[data.area]['serviceFee'] }}</td>
              <td>{{ data.commission }}</td>
            </tr>
          </table>
        </div>
        <div class="five">{{ map[data.area]['paymentTerm'] }}：{{ data.paymentTerm }}</div>
        <div class="six">{{ map[data.area]['company'] }}</div>
        <div class="border" />
      </div>
    </div>
    <el-button type="primary" @click="download">下载</el-button>
    <img :src="src" alt>
  </div>
</template>

<script>
import logo from '@/assets/image/logo.png'
import JsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'PdfTemplate',
  // props: {
  //   data: {
  //     type: Object,
  //     required: true
  //   }
  // },
  data() {
    return {
      logo,
      src: '',
      scale: 1,
      width: 1366,
      image: [],
      data: {
        area: 'zh',
        name: '客户名称',
        address: '客户地址',
        contact: '联系人名称',
        email: '联系人邮箱',
        invoiceCode: '单号编码',
        issueDate: '开具时间',
        totalAmount: '金额',
        forPeriod: '服务期',
        periodDiscountAmount: '期间折扣金额',
        serviceRateApplied: '应用折扣率',
        currency: '币种',
        commission: '佣金',
        paymentTerm: '付款方式'
      },
      map: {
        zh: {
          company: '深圳市信享科技有限公司',
          detail: '万科星火ONLINE 6栋4楼',
          street: '五和大道，坂田街道，龙岗区',
          area: '深圳，广东，中国',
          to: '客户',
          contact: '联系人',
          forPeriod: '服务期',
          periodDiscountAmount: '期间折扣金额',
          serviceRateApplied: '应用折扣率',
          invoice: '对账单',
          invoiceCode: '单号',
          issueDate: '开具日期',
          totalAmount: '金额',
          amount: '金额',
          serviceFee: '服务费',
          paymentTerm: '付款方式'
        },
        hk: {
          company: 'EARLYBIRD CASHFLOW INC.,LTD',
          detail: 'Unit B ,5th Floor , Gallo Commercial Building,',
          street: '114-118 Lockhart Road,',
          area: 'Wanchai ,HK',
          to: 'TO',
          contact: 'CONTACT',
          forPeriod: 'FOR PERIOD',
          periodDiscountAmount: 'Period Discount Amount',
          serviceRateApplied: 'Service Rate Applied',
          invoice: 'INVOICE',
          invoiceCode: 'INVOICE#',
          issueDate: 'ISSUE DATE',
          totalAmount: 'TOTAL AMOUNT',
          amount: 'AMOUNT',
          serviceFee: 'SERVICE FEE',
          paymentTerm: 'PAYMENT TERM'
        }
      }
    }
  },
  computed: {
    option() {
      return {
        scale: this.scale,
        width: this.width
      }
    }
  },
  watch: {
    option() {
      this.getImage('pdf')
    }
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.getImage('pdf')
    }, 1000)
  },
  methods: {
    getImage(ID) {
      const element = document.getElementById(ID)
      const width = element.offsetWidth// dom宽
      const height = element.offsetHeight// dom高
      const scale = window.devicePixelRatio// 放大倍数
      const canvas = document.createElement('canvas')
      canvas.width = width * scale// canvas宽度
      canvas.height = height * scale// canvas高度
      const content = canvas.getContext('2d')
      content.scale(scale, scale)
      const rect = element.getBoundingClientRect()// 获取元素相对于视察的偏移量
      content.translate(-rect.left, -rect.top)// 设置context位置，值为相对于视窗的偏移量负值，让图片复位
      html2canvas(element, {
        scale: scale,
        canvas: canvas,
        width: width
      }).then(canvas => {
        // 返回图片dataURL，参数：图片格式和清晰度(0-1)
        this.image = canvas
        this.src = canvas.toDataURL('image/jpeg', 1.0)
      })
    },
    download() {
      const pageData = this.image.toDataURL('image/jpeg', 1.0)

      const dims = {
        a2: [1190.55, 1683.78],
        a3: [841.89, 1190.55],
        a4: [595.28, 841.89]
      }
      // 方向默认竖直，尺寸ponits，格式a2
      const pdf = new JsPDF('', 'pt', 'a4')

      const a4Width = dims['a4'][0]
      const a4Height = dims['a4'][1]

      const contentWidth = this.image.width
      const contentHeight = this.image.height

      const pageHeight = (contentWidth / a4Width) * a4Height
      let leftHeight = contentHeight
      let position = 0
      const imgWidth = a4Width
      const imgHeight = (a4Width / contentWidth) * contentHeight

      if (leftHeight < pageHeight) {
        // addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight
          position -= a4Height

          if (leftHeight > 0) {
            pdf.addPage()
          }
        }
      }

      pdf.save(
        `${this.data.name}${this.data.market_name}${this.data.market_name}${this.data.area}${this.data.time}.pdf`
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.block{
  width: 300px;
  margin:0 auto;
}
#pdf {
  // position: absolute;
  // left: 10000px;
  width: 894px;
  padding: 0 100px;
  margin: 0 auto;
}
.one {
  height: 150px;
  .logo {
    width: 200px;
    float: left;
    margin-left: 8px;
    margin-top: 30px;
  }
  .right {
    text-align: left;
    float: right;
    margin-top: 45px;
    width: 340px;
    .bold {
      font-size: 18px;
      font-weight: bolder;
      margin-bottom: 5px;
    }
    div {
      margin: 6px 0;
      font-size: 16px;
    }
  }
}
.two {
  margin: 15px 10px 0;
  .left {
    font-size: 18px;
    div {
      margin-top: 20px;
    }
    div:nth-child(3) {
      margin-top: 40px;
    }
  }
  .right {
    .title {
      font-size: 26px;
      letter-spacing: 2px;
      text-align: center;
      font-weight: bold;
      padding: 15px 12px 15px;
      background: rgb(232, 232, 232);
    }
    div:nth-child(2) {
      margin-top: 10px;
    }
    .list {
      width: 100%;
      padding: 0 10px;
      font-size: 16px;
      line-height: 42px;
      float: left;
      span {
        float: right;
      }
    }
  }
}
.three {
  margin-top: 50px;
  padding-left: 10px;
  div {
    margin: 5px;
    font-size: 18px;
    line-height: 25px;
  }
}
.four {
  margin-top: 50px;
  padding: 10px;
  .laoye-table {
    border-collapse: collapse;
    width: 100%;
  }
}
.five {
  padding: 10px;
  margin-top: 20px;
}
.six {
  padding: 10px;
  margin-top: 50px;
}
.border {
  width: 250px;
  height: 2px;
  background: #000;
  margin-top: 20px;
  margin-left: 10px;
  padding: 1px;
}
hr {
  margin: 0;
}
</style>

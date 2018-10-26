<template>
  <div class="container">
    <div class="tab">
      <div class="tab-content">
        <div><span :class="{chosen: useFlag == 1}" @click="tabSwitch(1)">可使用</span></div>
        <div><span :class="{chosen: useFlag == 0}" @click="tabSwitch(0)">不可使用</span></div>
      </div>
    </div>
    <div class="aviable-content" v-if="useFlag == 1">
      <div class="amount-info">
        <div class="amount-content">
          <p>总金额</p>
          <p class="fee-info">￥750.00</p>
          <span class="count">共计 4 张</span>
        </div>
        <div class="pay-code" @click="showPayCode()"><img src="/static/images/payment_code.png"></div>
      </div>
      <!-- 卡列表部分 -->
      <div class="card-container">
        <div class="card-content">
          <div class="card-item" v-for="item in cardList" :key="key">
            <div class="pic">
              <img :src="'/static/images/card_0' + (index+1) + '.png'" alt="">
            </div>
            <div class="operate">
              <p>{{item.cardValue}}元 x {{item.cardNum}}张</p>
              <p>
                <span>赠送好友</span>
                <span @click="goToDetail(index+1)">查看详情</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="history-container" v-if="useFlag == 0">
      <div class="history-content">
        <div class="history-item" v-for="item in historyCardList" :key="key" @click="goToDetail(index+1)">
          <div class="pic">
            <img :src="'/static/images/card_0' + (index+1) + '.png'">
          </div>
          <div class="info">
            <p class="card-title">面额：￥{{item.cardValue}}</p>
            <p class="card-num">共{{item.cardNum}}张</p>
            <p class="date-info">2018/10/25 12:12:12</p>
          </div>
          <span class="status-info">{{item.statusText}}</span>
        </div>
      </div>
      <div class="no_data" v-if="historyCardList.length == 0">
        <img src="/static/images/no_data.png">
        <span>暂无数据</span>
      </div>
    </div>
    <footer-bar :index="1"></footer-bar>
    <div class="mask" v-if="showModalStatus" @click="closeModal"></div>
    <div class="layer-box" v-if="showModalStatus">
      <p class="text">礼品卡付款码</p>
      <div class="barcode-box">
        <div class="barcode">
          <canvas canvas-id="bacCanvas" style="width: 100%;height: 50px;margin: 0 auto;"></canvas>
        </div>
        <div class="payCode">
          {{payCodeStr}}
          <view class="icon-eye" @click="toggleEntireCode"><img :src="'/static/images/' + (isShowPayCode ? 'xs' : 'yc') +'.png'" alt=""></view>
        </div>
      </div>
      <div class="qrcode"><canvas style="width: 130px;height: 130px;margin: 0 auto;" canvas-id="qrcCanvas"/></div>
      <div class="balance-info">礼品卡余额￥750.00</div>
    </div>
  </div>
</template>

<script>
  import drawQrcode from 'weapp-qrcode'
  import wxbarcode from 'wxbarcode'
  import footerBar from '@/components/footer-bar'
  let historyCardList = [{
    cardValue: 5,
    cardNum: 1,
    statusText: '已消费'
  }, {
    cardValue: 10,
    cardNum: 1,
    statusText: '已赠送'
  }, {
    cardValue: 15,
    cardNum: 1,
    statusText: '已退款'
  }, {
    cardValue: 10,
    cardNum: 1,
    statusText: '赠送中'
  }]
  export default {
    name: 'index',
    data () {
      return {
        showModalStatus: false,
        useFlag: 1, // 是否可用
        cardList: [{
          cardValue: 50,
          cardNum: 1
        }, {
          cardValue: 100,
          cardNum: 1
        }, {
          cardValue: 200,
          cardNum: 1
        }, {
          cardValue: 400,
          cardNum: 1
        }],
        historyCardList: [],
        payCode: 'C17239492002454903',
        payCodeStr: '',
        isShowPayCode: false // 是否显示支付码
      }
    },
    components: {
      footerBar
    },
    methods: {
      tabSwitch (useFlag) {
        this.useFlag = useFlag
      },
      goToDetail (id) {
        wx.navigateTo({
          url: `../detail/main?id=${id}`
        })
      },
      showPayCode () {
        this.showModalStatus = true
        wxbarcode.barcode('bacCanvas', this.payCode, 420, 100)
        drawQrcode({
          width: 130,
          height: 130,
          canvasId: 'qrcCanvas',
          text: this.payCode
        })
      },
      closeModal () {
        this.showModalStatus = false
        this.isShowPayCode = false
        this.payCodeStr = this.getFuzzyCode(this.payCode, 4)
      },
      /**
       * 获取模糊code
       * @param code  原始code
       * @param fuzzyLength 模糊位数
       */
      getFuzzyCode (code, fuzzyLength) {
        let lLen = Math.ceil((code.length - fuzzyLength) / 2)
        let rLen = code.length - fuzzyLength - lLen
        let reg = new RegExp(`^(\\w{${lLen}})\\w{4}(\\w{${rLen}})$`)
        return code.replace(reg, '$1****$2')
      },
      toggleEntireCode () {
        if (this.isShowPayCode) {
          this.payCodeStr = this.getFuzzyCode(this.payCode, 4)
        } else {
          this.payCodeStr = this.payCode
        }
        this.isShowPayCode = !this.isShowPayCode
      }
    },
    onLoad () {
      Object.assign(this.$data, this.$options.data())
    },
    mounted () {
      this.historyCardList = Math.random() < 0.6 ? historyCardList : []
      this.payCodeStr = this.getFuzzyCode(this.payCode, 4)
    }
  }
</script>

<style lang="less" scoped>
@import "./style";
</style>

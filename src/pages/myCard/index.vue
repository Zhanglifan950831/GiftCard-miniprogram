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
        <div class="pay-code"><img src="/static/images/payment_code.png"></div>
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
  </div>
</template>

<script>
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
        historyCardList: []
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
      }
    },
    onLoad () {
      Object.assign(this.$data, this.$options.data())
    },
    mounted () {
      this.historyCardList = Math.random() < 0.6 ? historyCardList : []
    }
  }
</script>

<style lang="less" scoped>
@import "./style";
</style>

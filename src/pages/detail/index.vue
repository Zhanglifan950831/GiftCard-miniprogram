<template>
  <div class="container">
    <div class="detail-pic">
      <img :src="cardDetail.modelPic">
    </div>
    <div class="title">礼品卡号</div>
    <div class="card-content">
      <div class="card-item">
        <div>80002510112054</div>
        <div class="icon" v-if="cardDetail.useFlag == 1"><img src="/static/images/xzkh.png" alt=""></div>
      </div>
    </div>
    <div class="title">卡详情</div>
    <div class="detail-content">
      <div class="item">
        <div class="description">卡面值</div>
        <div class="info-text">￥{{cardDetail.cardValue}}</div>
      </div>
      <div class="item">
        <div class="description">卡内余额</div>
        <div class="info-text">￥{{cardDetail.balance}}</div>
      </div>
      <div class="item">
        <div class="description">当前状态</div>
        <div class="info-text">{{cardDetail.userCardStatus}}</div>
      </div>
      <div class="item">
        <div class="description">购卡时间</div>
        <div class="info-text">{{cardDetail.buyDatetime}}</div>
      </div>
      <div class="item">
        <div class="description">有效时间</div>
        <div class="info-text">永久有效</div>
      </div>
      <div class="item">
        <div class="description">购卡订单</div>
        <div class="info-text">{{cardDetail.buyOrderNo}}</div>
      </div>
      <div class="item">
        <div class="description">适用商品</div>
        <div class="info-text">自营商品（特殊商品除外）</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {formatTime} from '../../utils'
  let now = new Date()
  let cardDetailList = [{
    cardValue: 100,
    balance: 50,
    userCardStatus: '用户已激活'
  }, {
    cardValue: 50,
    balance: 0.00,
    userCardStatus: '已赠送'
  }]
  export default {
    name: 'index',
    data () {
      return {
        id: '',
        cardDetail: {},
        cardNoList: []
      }
    },
    onLoad () {
      Object.assign(this.$data, this.$options.data())
    },
    mounted () {
      this.id = this.$root.$mp.query.id
      let cardDetail = cardDetailList[this.id % 2]
      cardDetail.modelPic = '/static/images/card_0' + this.id + '.png'
      cardDetail.useFlag = Math.random() < 0.5 ? 1 : 0
      cardDetail.buyDatetime = formatTime(now)
      cardDetail.buyOrderNo = now.getTime()
      this.cardDetail = cardDetail
    }
  }
</script>

<style lang="less" scoped>
@import "./style";
</style>

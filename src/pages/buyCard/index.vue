<template>
  <div class="container">
    <div class="card-poster"><img :src="poster"></div>
    <div class="custom-face" v-if="hasCustom">
      <div class="title">自定义卡面值</div>
      <div class="custom-info flex" :class="{current: chosenIdx == -1}" @click.stop="chooseThis(customSkuid, -1)">
        <div class="custon-content flex">
          <input type="number" placeholder="请输入卡面值" maxlength="4" v-model.lazy="customPrice">
        </div>
        <div class="numCount" v-if="chosenIdx == -1">
          <div class="minus icon-operation" @click.stop="decreaseCount(customCount, -1)"><img src="/static/images/icon_minus_gray.png" alt=""></div>
          <div class="num"><input type="number" :maxlength="maxLength" v-model.lazy="customCount"></div>
          <div class="plus icon-operation" @click.stop="addCount(customCount, -1)"><img src="/static/images/icon_plus.png" alt=""></div>
        </div>
      </div>
    </div>
    <!-- 卡面额部分 -->
    <div class="card-face" v-if="priceList.length > 0">
      <div class="title">选择卡面值</div>
      <div class="price-container">
        <div class="price-info" :class="{current: chosenIdx == index}" v-for="item in priceList" :key="index" @click.stop="chooseThis(item.skuid, index)">
          <div class="content">{{item.price}}&nbsp;元</div>
          <div class="numCount" v-if="chosenIdx == index">
            <div class="minus icon-operation" @click.stop="decreaseCount(item.num, index)"><img src="/static/images/icon_minus_gray.png" alt=""></div>
            <div class="num">
              <input type="number" :maxlength="maxLength" v-model.lazy="item.num">
            </div>
            <div class="plus icon-operation" @click.stop="addCount(item.num, index)"><img src="/static/images/icon_plus.png" alt=""></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 卡详情说明 -->
    <div class="card-detail" v-if="skuDescription">
      <div class="title">卡详情说明</div>
      <div class="detail-container">
        <wxParse :content="skuDescription"/>
      </div>
    </div>
    <!-- 购卡信息部分 -->
    <div class="cart-info">
      <div class="total-num">{{totalNum}}张</div>
      <div class="total-price">共{{totalPrice}}元</div>
      <button class="btn-pay" :class="{'btn-disable': totalPrice == 0}" open-type="getUserInfo" @getuserinfo="goPay" :disabled="totalPrice == 0">去付款</button>
    </div>
  </div>
</template>

<script>
  import wxParse from 'mpvue-wxparse'
  import HttpService from '../../utils/httpService'
  import API_CONFIG from '../../api/config'

  export default {
    name: 'index.vue',
    components: {
      wxParse
    },
    data () {
      return {
        skuId: '',
        poster: '',
        hasCustom: false, // 是否有自定义价格
        customPrice: '',
        customCount: 0,
        customSkuid: '',
        priceList: [],
        maxBuyCount: 0, // 最大购买数量
        maxLength: 0, // 自定义最大位数
        skuDescription: '',
        chosenIdx: 0
      }
    },
    computed: {
      totalNum () {
        let _totalNum = 0
        this.priceList.forEach(item => {
          _totalNum += item.num - 0
        })
        _totalNum += this.customCount - 0
        return _totalNum
      },
      totalPrice () {
        let _totalPrice = 0
        this.priceList.forEach(item => {
          _totalPrice += item.num * item.price
        })
        if (this.customPrice) {
          _totalPrice += this.customCount * this.customPrice
        }
        return _totalPrice
      }
    },
    methods: {
      getDetailInfo (skuId) {
        HttpService.GET(API_CONFIG.API_DETAIL, {sku_id: skuId, _platform_num: 6}).then(info => {
          if (info.code === 1001) {
            let detailInfo = info.data
            var _priceList = []
            /** 允许输入自定义数量的值 */
            var maxBuyCount = detailInfo.base_info.max_buy_count || 99
            var maxLength = maxBuyCount.toString().length
            detailInfo.base_info.related_skulist.forEach(item => {
              let optiontext = item.attrlist[0].optiontext
              let customAttr = item.categoryattr.match(/:\d{1}\|?/)[0].replace(':', '').replace('|', '')
              let isCurrent = item.skuid === skuId
              if (customAttr !== '1') {
                _priceList.push({
                  skuid: item.skuid,
                  price: optiontext - 0,
                  num: isCurrent ? 1 : 0
                })
              } else {
                this.hasCustom = true
                this.customSkuid = item.skuid
                this.customCount = isCurrent ? 1 : 0
                isCurrent && (this.chosenIdx = -1)
              }
            })
            // 排序价格列表
            if (_priceList.length > 1) {
              _priceList.sort((a, b) => {
                return a.price - b.price
              })
            }
            _priceList.forEach((item, idx) => {
              item.num === 1 && (this.chosenIdx = idx)
            })
            this.priceList = _priceList
            this.poster = detailInfo.extra_info.photo[0]
            this.maxBuyCount = maxBuyCount
            this.maxLength = maxLength
            this.skuDescription = detailInfo.base_info.sku_description
          }
        })
      },
      addCount (num, idx) {
        let maxBuyCount = this.maxBuyCount
        let currentCount = num >= maxBuyCount ? maxBuyCount : num - 0 + 1
        if (idx < 0) {
          this.customCount = currentCount
        } else {
          this.priceList[idx].num = currentCount
        }
      },
      decreaseCount (num, idx) {
        let currentCount = num - 1 >= 0 ? num - 1 : 0
        if (idx < 0) {
          this.customCount = currentCount
        } else {
          this.priceList[idx].num = currentCount
        }
      },
      chooseThis (skuId, idx) {
        this.skuId = skuId
        this.chosenIdx = idx
        if (idx < 0) {
          this.customCount = 1
          this.priceList.forEach((item, idx) => {
            this.priceList[idx].num = 0
          })
        } else {
          this.customCount = 0
          this.priceList.forEach((item, index) => {
            this.priceList[index].num = index === idx ? 1 : 0
          })
        }
      },
      goPay (e) {
        console.log(e.mp.detail)
      }
    },
    onLoad () {
      Object.assign(this.$data, this.$options.data())
    },
    created () {
    },
    mounted () {
      this.skuId = this.$root.$mp.query.skuId
      this.getDetailInfo(this.skuId)
    }
  }
</script>

<style lang="less" scoped>
  @import url("~mpvue-wxparse/src/wxParse.css");
  @import './style';
</style>

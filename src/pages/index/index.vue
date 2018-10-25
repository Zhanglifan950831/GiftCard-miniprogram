<template>
  <div class="container bottom-spce">
    <!-- 轮播图 -->
    <div class="banner">
      <swiper indicator-dots="true" autoplay="true" interval="3000" circular="true" duration="500">
        <block v-for="(item, index) in bannerList" :key="index">
          <swiper-item>
            <img :src="item.image" class="slide-image"/>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <!-- 主体内容部分 -->
    <div class="content" v-for="(floor, index) in cardList" :key="index">
      <div class="title">
        {{floor.title}}
      </div>
      <div class="card-info">
        <div class="card-item" @click="goBuyCard(item.skuid)" v-for="(item, idx) in floor.list[0].products" :key="idx">
          <img :src="item.picurl" />
          <img class="shadow" src="/static/images/wty.png"/>
          <span v-text="item.name"></span>
        </div>
      </div>
    </div>
    <footer-bar :index="0"></footer-bar>
  </div>
</template>

<script>
import card from '@/components/card'
import footerBar from '@/components/footer-bar'
import {API_CMS} from '../../api/config'
import HttpService from '../../utils/httpService'

export default {
  data () {
    return {
      bannerList: [],
      cardList: []
    }
  },

  components: {
    card,
    footerBar
  },

  methods: {
    getIndexData () {
      HttpService.GET(API_CMS).then(info => {
        let data = info.data
        this.bannerList = data.banner || []
        this.cardList = data.floors
      })
    },
    goBuyCard (skuId) {
      wx.navigateTo({
        url: '../buyCard/main?skuId=' + skuId
      })
    },
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    }
  },

  created () {
  },

  mounted () {
    this.getIndexData()
  }
}
</script>

<style lang="less" scoped>
@import "./style";
</style>

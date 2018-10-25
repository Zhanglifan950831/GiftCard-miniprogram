<template>
    <div class="footer">
      <button @click="goHome" :class="{active: index == 0}">我要购卡</button>
      <button open-type="getUserInfo" @getuserinfo="goToMyCard" :class="{active: index == 1}">我的礼品卡</button>
    </div>
</template>

<script>
  export default {
    props: ['index'],
    methods: {
      goHome () {
        if (this.index) {
          wx.reLaunch({
            url: '../index/main'
          })
        }
      },
      goToMyCard (e) {
        if (!e.mp.detail.userInfo) {
          console.log('拒绝授权')
          return false
        }
        /** 设置用户信息缓存  */
        wx.setStorageSync('userInfo', e.mp.detail.userInfo)
        if (!this.index) {
          wx.navigateTo({
            url: '../myCard/main'
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .footer {
    margin: 10px 20px 15px;
    background-color: #fff;
    display: flex;
    border-radius: 50px;
    border: 1px solid #44bf3b;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    box-shadow: 0 0 15px rgba(0,0,0,.25);
    position: fixed;
    bottom: 0;
    width: 90%;
    > button {
      width: 50%;
      line-height: 40px;
      border-radius: 0;
      border: none;
      padding: 0;
      font-size: 18px;
      color: #44bf3b;
      background-color: #fff;
    }
    > .active {
      background-color: #44bf3b;
      color: #fff !important;
    }
  }
</style>

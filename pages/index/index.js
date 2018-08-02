//index.js
//获取应用实例
const app = getApp();
import Util from "../../utils/util";
import HttpService from "../../utils/httpService";
import {Base64} from "../../utils/lib/base64.min";
import API_CONFIG from "../../utils/apiConfig";

var appId = app.globalData.appId;
Page({
  data: {
    userInfo: {},
    bannerList: [],
    swiperCurrent: 0,   // 轮播图当前选中下标
    cardList: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShowPhoneAuthModal: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    /**
     * 获取CMS数据
     * @param  {[Object]} info [返回数据]
     */
    HttpService.GET(API_CONFIG.API_CMS,{}).then(info => {
      let data = info.data;
      this.setData({
        bannerList: data.banner || [],
        cardList: data.floors
      });
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 轮播图改变事件
   * @param  {[type]} e [event对象]
   */
  swiperChange: function (e) {
    let _current = e.detail.current;
    if (e.detail.source) {
      this.setData({
        swiperCurrent: _current
      });
    } else {
      this.setData({
        swiperCurrent: 0
      });
    }
  },
  /**
   * 前往购卡页面
   * @param  {[type]} e [event对象]
   */
  goBuyCard: function (e) {
    let skuId = e.currentTarget.dataset.skuid;
    let entityId = e.currentTarget.dataset.entityid;
    wx.navigateTo({
      url: '../buyCard/buyCard?skuid=' + skuId
    });
  },
  /**
   * 检测是否显示手机授权
   * @param  {[type]} passport [description]
   */
  checkShowPhoneAuth: function(passport) {
    if (passport.isNeedRegister) {
      this.setData({
        isShowPhoneAuthModal: true
      });
      console.log("需要注册");
    } else {
      wx.navigateTo({
        url: '../myCard/myCard'
      })
    }
  },
  /**
   * 前往我的礼品卡
   */
  goToMyCard: Util.throttle(function (e) {
    if (!e.detail.userInfo) {
      console.log("拒绝授权");
      return false;
    }
    /** 设置用户信息缓存  */
    wx.setStorageSync("userInfo", e.detail.userInfo);

    let passport = Util.checkLogin();
    
    if (passport) {
      console.log("已登录");
      // 测试开始
      /*let sendData = {
        awardKey: "6-35ff81a0-9e2d-4287-bf6c-6fbacb2d2d38",
        nickName: "侧室1",
        cardValue: 0.01,
        fromUid: 1000239448,
        passport: {
          uid: 1000239448,
          skey: "HX59C0BA5E"
        }
      }
      wx.navigateTo({
        url: "../receiveCard/receiveCard?sendDataStr=" + JSON.stringify(sendData)
      });
      return;*/
      // 测试结束
      wx.navigateTo({
        url: "../myCard/myCard"
      });
    } else {
      console.log("未登录");
      Util.login(this.checkShowPhoneAuth);
    }
  }),
  onReachBottom: function () {
    wx.showLoading({  
      title: '玩命加载中',  
    });
    setTimeout(function () {
      wx.hideLoading();  
    }, 500)  
  }
})

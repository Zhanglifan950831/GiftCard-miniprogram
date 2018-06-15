//获取应用实例
const app = getApp();

import HttpService from "../../utils/httpService";
import Util from "../../utils/util";
import API_CONFIG from "../../utils/apiConfig"
const _platform_num = app.globalData._platform_num;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    awardKey: "",
    fromUid: 0,
    nickName: "",
    modelPic: "",
    cardValue: "0.00",
    count: 0,
    remark: "",
    isShowPhoneAuthModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // {awardKey: "6-c4014ca8-ed3c-470b-9b9f-02a8c5e74a0a", uid: "1000229700"}
    console.log(options);
    let {sendDataStr} = options;
    let sendData = JSON.parse(sendDataStr);
    let {awardKey,nickName, cardValue} = sendData,
        fromUid = sendData.passport.uid,
        skey = sendData.passport.skey;
    /** 解码昵称 */
    nickName = decodeURIComponent(nickName);
    this.setData({
      awardKey,
      fromUid,
      nickName,
      cardValue
    });
    HttpService.GET(API_CONFIG.API_GIFT_INFO, {
      awardKey,
      uid: fromUid,
      skey,
      _platform_num
    }).then(info => {
      if (info.code == 1) {
        let _data = info.data;
        console.log(_data);
        let _list = _data.list;
        this.setData({
          count: _data.total - _data.gived,
          modelPic: _list[0].modelPic,
          remark: decodeURIComponent(_list[0].remark)
        });
      } else {
        wx.showModal({
          title: '错误提示',
          showCancel: false,
          content: info.msg
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (opt) {
      
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  /**
   * [goHome 返回礼品卡首页]
   */
  goHome() {
    wx.reLaunch({
      url: '../index/index'
    });
  },
  /**
   * [receiveCard 领取卡]
   * @param  {[event]} e [event对象]
   */
  receiveCard(e) {
    if (!e.detail.userInfo) {
      console.log("拒绝授权");
      return false;
    }
    /** 设置用户信息缓存  */
    wx.setStorageSync("userInfo", e.detail.userInfo);
    let passport = Util.checkLogin();
    if (passport) {
      this.receiveCardOperate(passport);
    } else {
      console.log("未登录");
      Util.login(this.receiveCardOperate);
    }
  },
  /**
   * [receiveCardOperate 领取卡操作]
   * @param  {[type]} passport [description]
   * @return {[type]}          [description]
   */
  receiveCardOperate(passport) {
    let {awardKey, fromUid} = this.data;
    /** [userInfo 接收人用户信息] */
    let userInfo = wx.getStorageSync("userInfo");
    /** [receiverName 接收人昵称] */
    let receiverName = encodeURIComponent(userInfo.nickName);
    // 是否是群发
    let isChatRoom = wx.getStorageSync("isChatRoom") || 0;

    let receiveCardData = {awardKey, fromUid, receiverName, isChatRoom, _platform_num, ...passport};
    if (passport.isNeedRegister) {
      console.log("需要注册");
      /** 如果需要注册，将领卡数据临时保存下来 */
      wx.setStorageSync("receiveCardData", receiveCardData);
      this.setData({
        isShowPhoneAuthModal: true
      });
      return;
    }
    receiveCardData.toUid = passport.uid;
    console.log("----------------------------------------");
    console.log(receiveCardData);
    console.log("----------------------------------------");
    // receiveCardData.skey = passport.skey;
    HttpService.POST(API_CONFIG.API_RECEIVE_CARD, receiveCardData).then(info => {
        if (info.code == 1) {
          wx.showModal({
            title: '领取成功',
            showCancel: false,
            content: "恭喜您领取成功",
            success: res => {
              if (res.confirm) {
                wx.reLaunch({
                  url: "/pages/myCard/myCard"
                });
              }
            }
          });
        } else {
          wx.showToast({
            title: info.msg,
            icon: "none"
          })
        }
    });
  }
})
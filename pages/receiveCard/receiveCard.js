//获取应用实例
const app = getApp();

import HttpService from "../../utils/httpService";
import Util from "../../utils/util";
import API_CONFIG from "../../utils/apiConfig";
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
    isShowPhoneAuthModal: false,
    total: 0,
    gived: 0,
    receiverList: [],
    cardList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // {awardKey: "6-c4014ca8-ed3c-470b-9b9f-02a8c5e74a0a", uid: "1000229700"}
    console.log(options);
    let {sendDataStr} = options;
    let sendData = JSON.parse(sendDataStr);
    let {awardKey, nickName, cardValue, fromUid, passport} = sendData;
    /** 解码昵称 */
    nickName = decodeURIComponent(nickName);
    this.setData({
      awardKey,
      fromUid,
      nickName,
      cardValue
    });
    this.getGiftInfo(awardKey, passport);
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
   * [getGiftInfo 获取赠送中的卡信息数据]
   * @param  {[Object]} passport [登录态]
   */
  getGiftInfo(awardKey, passport) {
    let receiverList = [],
        cardList = [];
    let isChatRoom = wx.getStorageSync("isChatRoom") || 0;
    HttpService.GET(API_CONFIG.API_GIFT_INFO, {
      awardKey,
      ...passport,
      _platform_num
    }).then(info => {
      if (info.code == 1) {
        let _data = info.data;
        console.log(_data);
        let _list = _data.list;
        _list.forEach(item => {
          let cardId = item.wechatCardId;
          if (item.receiverUid) {
            // 如果转发给个人并且领取人列表已有数据,则停止加入数据
            if (!isChatRoom && receiverList.length > 0) {
              return;
            }
            receiverList.push({
              receiverUid: item.receiverUid,
              receiverName: decodeURIComponent(item.receiverName),
              receiverHead: item.receiverHead,
              count: isChatRoom ? 1 : _list.length,
              datetime: item.updateDatetime.replace(/-/g, "/")
            });
          } else {
            // 如果转发给群并且cardList已有数据,则停止加入数据
            if (isChatRoom && cardList.length > 0) {
              return;
            }
            cardId && cardList.push({cardId,code: item.cardNo});
          }
        });

        console.log(">>>可添加至卡包的cardList为：");
        console.log(cardList);
        console.log(">>>--------------------------");
        let _passport = Util.checkLogin();
        /** 是否可以领取 */
        let canReceive = _passport ? _list[0].uid == _passport.uid ? true : !!receiverList.find(item => item.receiverUid == _passport.uid): false;

        this.setData({
          count: _data.total - _data.gived,
          total: _data.total,
          gived: _data.gived,
          modelPic: _list[0].modelPic,
          remark: decodeURIComponent(_list[0].remark),
          receiverList,
          cardList,
          canReceive
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
    let {awardKey, fromUid, cardList} = this.data;
    /** [userInfo 接收人用户信息] */
    let userInfo = wx.getStorageSync("userInfo");
    /** [receiverName 接收人昵称] */
    let receiverName = encodeURIComponent(userInfo.nickName);
    /** [receiverHead 接收人头像] */
    let receiverHead = userInfo.avatarUrl;
    // 是否是群发
    let isChatRoom = wx.getStorageSync("isChatRoom") || 0;

    let receiveCardData = {awardKey, fromUid, receiverName, receiverHead, isChatRoom, _platform_num, ...passport};
    if (passport.isNeedRegister) {
      console.log("需要注册");
      /** 如果需要注册，将领卡数据临时保存下来 */
      wx.setStorageSync("receiveCardData", receiveCardData);
      /** 如果需要注册，将可以添加至卡包的cardList临时保存下来 */
      wx.setStorageSync("cardList", cardList);
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
                cardList.length > 0 && Util.wxAddCard(cardList);
                wx.reLaunch({
                  url: "/pages/myCard/myCard"
                });
              }
            }
          });
        } else if (info.code == 1020) {
          Util.login(this.receiveCardOperate);
        } else {
          wx.showToast({
            title: info.msg,
            icon: "none"
          })
        }
    });
  }
})
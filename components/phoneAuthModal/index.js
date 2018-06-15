import {register, createGiftCardOrder} from "../../utils/util"
import HttpService from "../../utils/httpService";
import API_CONFIG from "../../utils/apiConfig"

/**
 * 模块回调用函数
 */
const module_callback = {
  /** 首页模块回调 */
  index: () => {
    wx.navigateTo({
      url: "/pages/myCard/myCard"
    });
  },
  /** 购卡模块回调 */
  buyCard: (passport) => {
    let orderInfo =  wx.getStorageSync("orderInfo");
    let _orderData = orderInfo.orderData;
    _orderData.skey = passport.skey;
    _orderData.uid = passport.uid;
    console.log(_orderData);
    console.log("调用下单");
    createGiftCardOrder(orderInfo, passport);
    wx.removeStorageSync("orderInfo");
  },
  /** 领取卡回调 */
  receiveCard: (passport) => {
    let _receiveCardData = wx.getStorageSync("receiveCardData");
    _receiveCardData.toUid = passport.uid;
    _receiveCardData.uid = passport.uid;
    _receiveCardData.skey = passport.skey;
    console.log("----------------------------------------");
    console.log(_receiveCardData);
    console.log("----------------------------------------");
    HttpService.POST(API_CONFIG.API_RECEIVE_CARD, _receiveCardData).then(info => {
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
}

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    isShow: {
      type: Boolean,
      value: true
    },
    module: {
      type: String,
      value: ""
    }
  },
  data: {
    // 这里是一些组件内部数据

  },
  methods: {
    closeModal: function() {
      this.setData({
        isShow: false
      });
    },
    getPhoneNumber: function(e) {
      let _info = e.detail;
      var module = this.properties.module
      this.closeModal();
      if (_info.iv && _info.encryptedData) {
        register(module_callback[module], _info.encryptedData, _info.iv);
      } else {
        setTimeout(function() {
          wx.showToast({
            title: "您取消授权了",
            icon: "none"
          });
        }, 500);
      }
    }
  }
})
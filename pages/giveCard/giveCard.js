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
    serialNo: "",
    cardValue: 0,
    cardNum: 0,
    isBatch: false,
    modelPic: "",       // 卡面
    orderId: "",
    count: 1,
    remark: "",
    sendData: {},       // 赠送数据
    isShowModal: false  // 是否显示确认模态框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let giveData = JSON.parse(options.data);
    let {cardValue, cardNum, isBatch, modelPic} = giveData;
    this.setData({
      cardValue, cardNum, isBatch, modelPic
    });
    if (giveData.isBatch) {
      let serialNo = giveData.serialNo;
      this.setData({
        serialNo
      });
    } else {
      let orderId = giveData.orderId;
      this.setData({
        orderId
      }); 
    }
    
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
    if (this.data.sendData.awardKey) {
      this.cancelGift();
      console.log("头部返回取消赠送");
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    if (options.from == "button") {
      console.log("事件源为button");
      console.log("开始转发");
    }
    this.closeModal();
    let sendDataStr = JSON.stringify(this.data.sendData);
    let _this = this;
    return {
      title: '转赠一份礼品卡',
      path: `/pages/receiveCard/receiveCard?sendDataStr=${sendDataStr}`,
      imageUrl: this.data.modelPic,
      success: function(res) {
        console.log("转发成功跳转回我的礼品卡");
        _this.setData({
          sendData: {}
        });
        wx.reLaunch({
          url: "/pages/myCard/myCard"
        });
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败");
        _this.cancelGift();
        console.log("取消赠送");
      }
    }
  },
  getCount(e) {
    let _value = e.detail.value;
    this.setData({
      count: _value
    });
  },
  getRemark(e) {
      this.setData({
        remark: e.detail.value
      });
  },
  sendCard: function () {
    let passport = Util.checkLogin();
    let userInfo = wx.getStorageSync("userInfo");
    var _data = {
      passport,
      cardValue: this.data.cardValue,
      nickName: encodeURIComponent(userInfo.nickName),
      awardKey: ""
    };
    let _count = this.data.count;
    if (_count > this.data.cardNum) {
        return wx.showModal({
              title: '提示',
              showCancel: false,
              content: "赠送数量不得超过您已有卡数量"
            });
    }

    let _remark = this.data.remark || "祝心想事成，天天开心!";
    _remark = _remark.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/g, function ($1) {
      return encodeURIComponent($1);
    });
    let giveCardParam = {
        ...passport, _platform_num,
        num: _count,
        remark: _remark
    };
    let requestUrl = API_CONFIG.API_BATCH_GIFT_CARD;
    if (this.data.isBatch) {
        giveCardParam.serialNo = this.data.serialNo;
    } else {
        giveCardParam.orderId = this.data.orderId;
    }
    HttpService.POST(requestUrl,giveCardParam).then(info => {
        if (info.code == 1) {
            _data.awardKey = info.data;
            this.setData({
              sendData: _data,
              isShowModal: true
            });
        } else {
            wx.showModal({
                title: '错误提示',
                showCancel: false,
                content: info.msg
            });
        }
    });
  },
  /**
   * [cancelGift 取消赠送]
   * @return {[type]} [description]
   */
  cancelGift() {
    this.closeModal();
    let passport = Util.checkLogin();
    let withdrawGivingData = {
        ...passport, _platform_num,
        awardKey: this.data.sendData.awardKey
    }
    HttpService.POST(API_CONFIG.API_WITHDRAW_GIFT_CARD, withdrawGivingData).then(info => {
        if (info.code == 1) {
          this.setData({
            sendData: {}
          })
        } else {
          console.log(info);
        }
    });
  },
  closeModal() {
    this.setData({
      isShowModal: false
    });
  }
})
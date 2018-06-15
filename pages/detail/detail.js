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
    cardDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let passport =  Util.checkLogin(),
        serialNo = options.serialNo;
    HttpService.GET(API_CONFIG.API_CARD_DETAIL, {
        serialNo, _platform_num,
        ...passport
    }).then(info => {
      if (info.code == 1) {
        let cardDetail = info.data;
        /** 替换日期"-"为"/" */
        cardDetail.buyDatetime = cardDetail.buyDatetime.replace(/-/g,"/");
        cardDetail.invalidDatetime = cardDetail.invalidDatetime.replace(/-/g,"/");
        this.setData({
          cardDetail
        });
      } else {
        wx.showToast({
          title: info.msg,
          icon: "none"
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
    
  }
})
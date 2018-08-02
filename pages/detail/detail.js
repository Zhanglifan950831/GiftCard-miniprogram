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
    cardDetail: {},
    cardNoList: [],
    cardList: []
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
        let cardNoList = [];
        cardDetail.cardNoList.forEach((item, idx) => {
          let selected = false;
          if (cardDetail.wechatCardId && item.wechatPackage == 0 && !cardNoList.find(item => item.selected)) {
            selected = true;
          };
          cardNoList.push({
            ...item,
            selected
          });
        });
        this.setData({
          cardDetail,
          cardNoList
        });
        this.getCardList(cardNoList);
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
    
  },
  /**
   * [toggleChoose 切换选择]
   * @param  {[Object]} e [event对象]
   */
  toggleChoose(e) {
    if (!this.data.cardDetail.useFlag) {
      return false
    }
    let cardId = this.data.cardDetail.wechatCardId;
    if (!cardId) {
        return wx.showToast({title: "抱歉，该礼品卡尚不能添加至卡包",icon: "none"});
    };
    let _index = e.currentTarget.dataset.index;
    let cardNoList = this.data.cardNoList;
    cardNoList[_index].selected = !cardNoList[_index].selected;
    this.getCardList(cardNoList);
  },

  /**
   * [getCardList 获取可添加至卡包的cardList]
   * @param  {[Array]} cardNoList [卡号列表]
   */
  getCardList(cardNoList) {
    if (!cardNoList.find(item => item.selected)) {
      return;
    };
    let cardId = this.data.cardDetail.wechatCardId,
        cardList = [];
    
    cardNoList.forEach((item,idx) => {
        if (item.selected) {
          if (item.wechatPackage == 0) {
            cardId && cardList.push({cardId, code: item.cardNo});
          } else {
            cardNoList[idx].selected = false;
            let tipMsg = item.wechatPackage == 1 ? "该礼品卡已添加到卡包": "该礼品卡已被您从卡包删除，请从卡包里恢复";
            return wx.showToast({
                        title: `抱歉，${tipMsg}`,
                        icon: "none"
                      });
          }
        }
    });
    this.setData({
      cardNoList, 
      cardList
    });
  },

  /**
   * [addCard 添加到微信卡包]
   */
  addCard() {
    let cardList = this.data.cardList,
        cardId = this.data.cardDetail.wechatCardId;
    if (cardList.length > 0) {
      Util.wxAddCard(cardList, () => {
        console.log("领取成功");
        /*wx.showModal({
          title: '添加成功',
          showCancel: false,
          content: "恭喜您添加到微信卡包成功",
          success: res => {
            if (res.confirm) {
              wx.reLaunch({
                url: "/pages/myCard/myCard"
              });
            }
          }
        });*/
        wx.redirectTo({
          url: '/pages/myCard/myCard',
        });
      });
    }
  }
})
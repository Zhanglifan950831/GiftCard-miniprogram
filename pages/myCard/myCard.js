//获取应用实例
const app = getApp();

import HttpService from "../../utils/httpService";
import Util from "../../utils/util";
import API_CONFIG from "../../utils/apiConfig"
import COMMON_CODE from "../../utils/commonCode"

const _platform_num = app.globalData._platform_num;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    cardList:[
      /*{image:"../../images/card1.png", count:2, fee:100, selected: false},
      {image:"../../images/card2.png", count:2, fee:50, selected: false},
      {image:"../../images/card3.png", count:1, fee:500, selected: false}*/
    ],
    historyCardList: [],
    payCodeStr: "",
    payCode: "",
    useFlag: 1,           // 是否可用
    start: 1,             // 起始页
    pageSize: 10,         // 每页记录数
    cardTotalSum: 0,      //可用卡总数
    historyTotalSum: 0,   // 不可用总数
    totalBalance: 0,      // 总余额
    isShowPayCode: false, // 是否显示支付码
    iconEye: "/images/yc.png",
    aviableCardTotal: 0   // 可用卡总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let passport = Util.checkLogin();
    this.cardListQuery(passport);
    this.queryBanlance(passport);
    this.getAviableCardTotal(passport);
  },

  /**
   * [getAviableCardTotal 获取可用卡总数]
   */
  getAviableCardTotal(passport) {
    let queryParam = {
        _platform_num,
        start: 1,
        pageSize: 10,
        useFlag: 1,
        uid: passport.uid,
        skey: passport.skey
    };
    HttpService.GET(API_CONFIG.API_CARD_LIST, queryParam).then(info => {
      if (info.code == 1 && info.data) {
          this.setData({
            aviableCardTotal: info.totalSum
          })
      } else if(info.code == 1020) {
          Util.login(this.getAviableCardTotal);
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
    this.setData({
      start: 1,
      cardList: [],
      historyCardList: []
    });
    let passport = Util.checkLogin();
    this.getAviableCardTotal(passport);
    this.cardListQuery(passport);
    this.queryBanlance(passport);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    let currentPage = this.data.start;
    if (this.data.historyTotalSum > this.data.historyCardList.length) {
      wx.showLoading({  
        title: '玩命加载中',  
      });
      this.setData({
        start: currentPage + 1
      });
      let passport = Util.checkLogin();
      this.cardListQuery(passport);
      setTimeout(function () {
        wx.hideLoading();  
      }, 500);
    }
    
  },

  queryBanlance(passport) {
    HttpService.GET(API_CONFIG.API_CARD_BALANCE, {
      ...passport,
      _platform_num
    }).then(info => {
      if (info.code == 1) {
        this.setData({
          totalBalance: info.data.totalBalance
        })
      } else if(info.code == 1020) {
          Util.login(this.queryBanlance);
      }
    })
  },

  cardListQuery: function (passport) {
    let useFlag = this.data.useFlag,
        start = this.data.start,
        pageSize = this.data.pageSize,
        _cardList = this.data.cardList,
        _historyCardList = this.data.historyCardList,
        _cardTotalSum = this.data.cardTotalSum,
        _historyTotalSum = this.data.historyTotalSum;
    
    // {skey: "HX107311BA", uid: "1000229700"}
    let queryParam = {
        /*sourceType: "00",
        cardKind: "01",*/
        useFlag, start, pageSize,_platform_num,
        groupType: 1,
        uid: passport.uid,
        skey: passport.skey
    };
    if (useFlag == 1) {
      if (_cardTotalSum == _cardList.length && _cardTotalSum != 0) {
        return false;
      }
    } else {
      if (_historyTotalSum == _historyCardList.length && _historyTotalSum != 0) {
        return false;
      }
    }
    
    HttpService.GET(API_CONFIG.API_CARD_LIST, queryParam).then(info => {
      if (info.code == 1 && info.data) {
          let _data = info.data;
          let _totalNum = info.totalSum;
          if (useFlag == 1) {
              this.setData({
                cardTotalSum: _totalNum
              });
              _cardList = _cardList.concat(_data);
          } else {
            this.setData({
              historyTotalSum: _totalNum
            });
            _historyCardList = _historyCardList.concat(this.getCardListWithStatus(_data));
          }
          this.setData({
              cardList: _cardList,
              historyCardList: _historyCardList
          });
      } else if(info.code == 1020) {
          Util.login(this.cardListQuery);
      }
    })
  },

  getCardListWithStatus(cardList){
      cardList.forEach((item, idx) => {
        if (item.updateDatetime) {
          cardList[idx].updateDatetime = item.updateDatetime.replace(/-/g,"/");
        }
          /**
           * 卡状态文字
           * @type {String}
           */
          var statusText = "";
          switch(item.userStatus) {
            case "01" : statusText = "已激活";
                        break;
            case "02" : statusText = "已充值";
                        break;
            case "03" : statusText = "赠送中";
                        break;
            case "04" : statusText = "已赠送";
                        break;          
            case "05" : statusText = "已失效";
                        break;
            case "06" : statusText = "已退款";
                        break;
            case "10" : statusText = "已绑定";
                        break;
            default : break;
          }
          cardList[idx].statusText = statusText;
          // cardList[idx].dateInfo = Util.formatTime(new Date(item.createDatetime));
      });
      return cardList;
  },
  /**
   * 显示付款码
   */
  showPayCode: function () {
    let passport = Util.checkLogin();
    HttpService.GET(API_CONFIG.API_PAY_CODE, {
      uid: passport.uid,
      skey: passport.skey,
      paymentMode: "03",
      generateChannel: "02",
      _platform_num
    }).then(info => {
        if (info.code == 1) {
          let payCode = info.data.payCode;
          this.setData({
            showModalStatus: true,
            isShowPayCode: false,
            iconEye: "/images/yc.png",
            payCodeStr: payCode.replace(/^(\d{7})\d{4}(\d{7})$/,"$1****$2"),
            payCode: payCode
          });
          COMMON_CODE.barcode(payCode, "bacCanvas", 410, 150);
          COMMON_CODE.qrcode(payCode, "qrcCanvas", 375, 375);
        } else {
          wx.showModal({
            title: '错误提示',
            showCancel: false,
            content: info.msg
          })
        }
    })
  },

  /**
   * [toggleEntireCode 切换支付码隐藏状态]
   */
  toggleEntireCode() {
    let _isShowPayCode = this.data.isShowPayCode;
    let iconEye = "";
    let payCodeStr = this.data.payCode;
    if (_isShowPayCode) {
      iconEye = "/images/yc.png";
      payCodeStr = payCodeStr.replace(/^(\d{7})\d{4}(\d{7})$/,"$1****$2");
    } else {
      iconEye = "/images/xs.png";
    }
    this.setData({
      iconEye, payCodeStr,
      isShowPayCode: !_isShowPayCode
    });
  },

  prevent() {},
  /**
   * 关闭遮罩
   */
  closeModal: function () {
    this.setData({
      showModalStatus: false
    });
  },
  /**
   * 前往历史记录
   */
  goHistoryRecord: function () {
    wx.navigateTo({
      url: '../historyRecord/historyRecord'
    });
  },
  /**
   * 切换礼品卡展开状态
   * @param  {[type]} e [event对象]
   */
  toggleExtendCard: function (e) {
    let _currentIdx = e.currentTarget.dataset.index;
    let _cardList = this.data.cardList;
    _cardList.forEach(function(item, idx){
      if (_currentIdx == idx) {
        item.selected = !item.selected;
      } else {
        item.selected =  false;
      }
    });
    this.setData({
        cardList: _cardList
    })
  },
  /**
   * 查看详情
   * @param  {[type]} e [event对象]
   */
  goToDetail: function (e) {
    let serialNo = e.currentTarget.dataset.serialNo;
    /*if (serialNo.split("_")[0] == "null") {
      return;
    };*/
    wx.navigateTo({
      url: '../detail/detail?serialNo=' + serialNo
    })
  },
  /**
   * [goSendCard 赠送礼品卡]
   * @param  {[type]} e [event对象]
   * @return {[type]}   [description]
   */
  goSendCard: function (e) {
    let _currentIdx = e.currentTarget.dataset.index;
    let cardInfo = this.data.cardList[_currentIdx];
    cardInfo.isBatch = true;
    console.log(cardInfo);
    if (cardInfo.canGiveOut) {
      wx.navigateTo({
        url: '../giveCard/giveCard?data=' + JSON.stringify(cardInfo)
      });
    } else {
      wx.showToast({
        title:"该礼品卡不可赠送",
        icon: "none"
      });
    }
    
  },
  goHome: function () {
    wx.reLaunch({
      url: '../index/index'
    });
  },
  goToMyCard: function () {
    wx.navigateTo({
      url: '../myCard/myCard'
    })
  },
  /**
   * tab选项卡切换
   * @param  {[Object]} e [event对象]
   */
  tabSwitch: function (e) {
    let _index = e.currentTarget.dataset.index;
    let passport = Util.checkLogin();
    this.setData({
      useFlag: _index
    });
    this.cardListQuery(passport);
  }
})
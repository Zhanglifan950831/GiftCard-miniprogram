//获取应用实例
const app = getApp();
import Util from "../../utils/util";
import md5 from "../../utils/lib/md5.min";
import HttpService from "../../utils/httpService";
import API_CONFIG from "../../utils/apiConfig"

const appId = app.globalData.appId;
const _platform_num = app.globalData._platform_num;
const partnerId = 507;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: "",
    chosenIdx: 0, // 选中下标值
    cardPicList: [
      "../../images/card1.png",
      "../../images/card2.png",
      "../../images/card3.png"
    ],
    hasCustom: false,   // 是否有自定义价格
    customCount: 0,
    customPrice: 0,
    customPriceStr: "",
    customSkuid: "",
    priceList: [],
    maxBuyCount: 0,   // 最大购买数量
    maxLength: 0,     // 自定义最大位数
    totalNum: 0,
    totalPrice: 0,
    currentSkuid: "", // 当前skuid
    currentChannelId: 1,    // 当前渠道ID
    currentEntityId: 8002,    // 当前实体ID
    currentStoreId: 8000,      // 当前门店ID
    disablePay: true,
    isShowPhoneAuthModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentSkuid: options.skuid
    });
    /**
     * 获取商品详情
     * @param  {[Object]} info) {                   let detailInfo [详情信息]
     */
      HttpService.GET(API_CONFIG.API_DETAIL, {sku_id: options.skuid, _platform_num}).then(info => {
        if (info.code = 1001) {
          let detailInfo = info.data;
          var _priceList = [];
          var _this = this;
          /** 允许输入自定义数量的值 */
          var maxBuyCount = detailInfo.base_info.max_buy_count || 99;
          var maxLength = maxBuyCount.toString().split("").length;
          detailInfo.base_info.related_skulist.forEach(function(item, idx){
              let optiontext = item.attrlist[0].optiontext;
              let customAttr = customAttr = item.categoryattr.match(/:\d{1}\|?/)[0].replace(":","").replace("|","");
              let isCurrent = item.skuid == options.skuid;
              if (customAttr != "1") {
                _priceList.push({
                  skuid: item.skuid,
                  isCurrent: isCurrent,
                  price: optiontext - 0,
                  num: isCurrent ? 1: 0
                });
              } else {
                _this.setData({
                  hasCustom: true,
                  customSkuid: item.skuid,
                  customCount: isCurrent ? 1 :0
                })
              }
          });
          this.setData({
            maxBuyCount,
            maxLength,
            poster: detailInfo.extra_info.photo[0],
            priceList: _priceList
          });
          this.getTotalNum();
          this.getTotalPrice();
        }
      });
  },
  /**
   * 选择当前卡面
   * @param  {[type]} e [event对象]
   */
  chooseCurrentPic: function (e) {
    let currentIdx = e.currentTarget.dataset.index; 
    this.setData({
      chosenIdx: currentIdx,
      poster: this.data.cardPicList[currentIdx]
    });
  },
  /**
   * 重定向
   * @param  {[event]} e [event对象]
   */
  redirect: function(e) {
    let _skuid = e.currentTarget.dataset.skuid;
    if (_skuid != this.data.currentSkuid) {
      wx.redirectTo({
        url: "/pages/buyCard/buyCard?skuid="+ _skuid
      });
    }
  },
  /**
   * 添加数量
   * @param {[type]} e [event对象]
   */
  addCount: function (e) {
    /** 获取当前操作价格列表的下标 */
    let _index = e.currentTarget.dataset.index;
    if (_index < 0) {
      if (this.data.customPrice) {
        let _custonCount = this.data.customCount;
        this.setData({
          customCount: _custonCount +1
        });
      }
    } else {
      let priceList = this.data.priceList;
      let _num = priceList[_index].num;
      priceList[_index].num = _num + 1;
      this.setData({
        priceList: priceList
      }); 
    }
    
    this.getTotalNum();
    this.getTotalPrice();
  },
  /**
   * 减少数量
   * @param  {[type]} e [event对象]
   */
  decreaseCount: function (e) {
    /** 获取当前操作价格列表的下标 */
    let _index = e.currentTarget.dataset.index;
    if (_index < 0) {
      if (this.data.customPrice) {
        let _custonCount = this.data.customCount;
        if (_custonCount - 1 == 0) {
          this.setData({
            customPrice: 0,
            customPriceStr: ""
          });
        }
        this.setData({
          customCount: _custonCount - 1 >= 0 ? _custonCount - 1 : 0
        });
      };
    } else {
      let priceList = this.data.priceList;
      let _num = priceList[_index].num;
      priceList[_index].num = _num - 1 >= 0 ? _num-1 : 0 ;
      this.setData({
        priceList: priceList
      }); 
    }
    
    this.getTotalNum();
    this.getTotalPrice();
  },
  /**
   * 获取礼品卡总数
   */
  getTotalNum: function () {
    var _totalNum = 0;
    this.data.priceList.forEach(function(item, idx){
      _totalNum += item.num;
    });
    _totalNum += this.data.customCount;
    this.setData({
      totalNum: _totalNum
    });
  },
  /**
   * 获取礼品卡支付金额
   */
  getTotalPrice: function () {
    var _totalPrice = 0;
    this.data.priceList.forEach(function(item, idx){
      _totalPrice += item.num * item.price;
    });
    _totalPrice += this.data.customCount * this.data.customPrice;
    this.setData({
      totalPrice: _totalPrice,
      disablePay: _totalPrice == 0
    });
  },
  /**
   * 获取自定义卡面值
   * @param  {[Object]} e [event对象]
   */
  getCustomPrice: function (e) {
    let _value = e.detail.value;
    if (_value && /^[1-9]\d*$/.test(_value) && _value <= 1000) {
      this.setData({
          customPrice: _value -0,
          customCount: this.data.customCount >= 1 ? this.data.customCount : 1
        });
    } else {
      wx.showToast({
        title: "只能输入1-1000的整数",
        icon: "none"
      });
      this.setData({
        customPriceStr: "",
        customPrice: 0,
        customCount: 0
      });
    }
    this.getTotalNum();
    this.getTotalPrice();
  },
  /**
   * [getCustomCount 获取自定义的数量]
   * @param  {[Object]} e [event对象]
   */
  getCustomCount(e) {
    let _value = e.detail.value;
    let _index = e.currentTarget.dataset.index;
    let priceList = this.data.priceList;
    if (_value && /^[1-9]\d*$/.test(_value)) {
        let _count = _value - 0;
        if (_count > this.data.maxBuyCount) {
            _count = this.data.maxBuyCount;
            wx.showToast({
              title: `最大购买数量为${this.data.maxBuyCount}`,
              icon: "none"
            });
        };
        if (_index == -1) {
          this.setData({
            customCount: _count
          });
        } else {
          priceList[_index].num = _count;
          this.setData({
            priceList
          });
        }
    } else {
      wx.showToast({
        title: "只能输入1-1000的整数",
        icon: "none"
      });
      if (_index >= 0) {
        priceList[_index].num = 0;
        this.setData({
          priceList
        });
      } else {
        this.setData({
          customPriceStr: "",
          customPrice: 0,
          customCount: 0
        });
      }
    }
    this.getTotalNum();
    this.getTotalPrice();
  },
  /**
   * 去付款
   */
  goPay: function (e) {
    if (!e.detail.userInfo) {
      console.log("拒绝授权");
      return false;
    }
    /** 设置用户信息缓存  */
    wx.setStorageSync("userInfo", e.detail.userInfo);
    
    let passport = Util.checkLogin();
    if (passport) {
      this.payOperate(passport);
      /*wx.navigateTo({
        url: "/pages/myCard/myCard"
      });*/
    } else {
      console.log("未登录");
      Util.login(this.payOperate);
    }
    
  },
  payOperate: function(passport) {
    /** [totalPricePay 下单的支付金额(单位是分)] */
    let totalPricePay = this.data.totalPrice *100;
    let orderInfo = {
      poster: this.data.poster
    };
    /**
     * [orderData 下单数据]
     * @type {Object}
     */
    let orderData = {
      sku_id: this.data.currentSkuid,
      buy_count: this.data.totalNum,
      source: 14,
      entity_id: 8002,
      channel_id: 1,
      partner_id: partnerId,
      total_pay: totalPricePay,
      sku_total_price: totalPricePay,
      storeId: 8000,
      _platform_num
    };
    /*orderData = {
      sku_id: 105,
      buy_count: this.data.totalNum,
      source: 14,
      entity_id: 8002,
      channel_id: 1,
      partner_id: partnerId,
      total_pay: 1 * this.data.totalNum,
      sku_total_price: 1 * this.data.totalNum,
      storeId: 8000,
      _platform_num,
    };*/
    orderInfo.orderData = orderData;
    if (passport.isNeedRegister) {
        console.log("需要注册");
        /** 如果需要注册，将下单数据临时保存下来 */
        wx.setStorageSync("orderInfo", orderInfo);
        this.setData({
          isShowPhoneAuthModal: true
        });
    } else {
      /**
       * 获取选中的礼品卡面额信息列表
       * @param  {[Object]} item [循环项]
       * @param  {[Integer]} idx) {                 return item.num > 0;    } [判断卡数量是否大于0]
       * @return {[Array]}      [选中信息列表]
       */
      var _arr = this.data.priceList.filter(function(item, idx) {
        return item.num > 0;
      });
      /** 用户已登录情况下，给下单数据增加skey和uid属性 */
      orderData.skey = passport.skey;
      orderData.uid = passport.uid;
      console.log(orderData);
      console.log(orderInfo);
      /**
       * 创建订单
       */
      Util.createGiftCardOrder(orderInfo, passport);
    }
  }
})
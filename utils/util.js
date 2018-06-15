import md5 from "./lib/md5.min";
import HttpService from "./httpService";
import API_CONFIG from "../utils/apiConfig"

const app = getApp();
const appId = app.globalData.appId;
const _platform_num = app.globalData._platform_num;
const partnerId = 507;

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取32位随机字符串
 * @return {[String]} [32位随机字符串]
 */
var getNonceStr = function() {
  var rangArr = [{
      startIdx: 0,
      /** 起始位 */
      endIdx: 9 /** 结束位 */
    }, {
      startIdx: 65,
      endIdx: 90
    }, {
      startIdx: 97,
      endIdx: 122
    }],
    strArr = [],
    nonceStr = "";

  /**
   * 创建字符串数组
   * @param  {[Object]} item [循环项目]
   * @param  {[Integer]} idx) {                   for (var i [description]
   * @return {[Array]}      [字符串数组]
   */
  rangArr.forEach(function(item, idx) {
    for (var i = item.startIdx; i <= item.endIdx; i++) {
      var _str = i.toString();
      if (idx > 0) {
        _str = String.fromCharCode(i);
      }
      strArr.push(_str);
    };
  })

  for (var i = 0; i < 32; i++) {
    var _index = Math.floor(Math.random() * strArr.length);
    nonceStr += strArr[_index]
  };
  return nonceStr;
};

/**
 * 获取当前时间戳
 * @return {[long]} [当前时间戳]
 */
var getCurrentTimeStamp = function() {
  return Date.parse(new Date()) / 1000;
}

/**
 * 通用签名生成
 * @param  {[Object]} param [参数数据]
 * @return {[String]}       [生成的签名]
 */
var commonSign = function(param) {
  let _paramArr = [];
  for (var key in param) {
    (key != "sign" && param[key]) && _paramArr.push(key + "=" + param[key]);
  };
  return md5(_paramArr.join("&"));
}

/**
 * 检测是否登陆
 */
var checkLogin = function() {
  try {
    let passport = wx.getStorageSync('passport')
    if (passport && passport.uid) {
      return passport;
    }
  } catch (e) {}
  return false;
}

/**
 * 登录
 * @param  {Function} success [成功的回掉]
 * @return {[Boolean]}        [是否需要注册]
 */
var login = function(success = () => {}) {
  wx.showLoading({
    title: '登录中'
  });
  wx.login({
    success: res => {
      let code = res.code;
      let loginParam = {
          code,_platform_num,
          appid: appId
      };
      HttpService.POST(API_CONFIG.API_USER_LOGIN, loginParam).then(info => {
        console.log(info);
        if (info.errno == 0) {
          const {
            skey,
            uid
          } = info.data;
          wx.setStorage({
            key: 'passport',
            data: {
              skey,
              uid
            },
            success: () => {
              success({
                skey,
                uid
              });
            }
          });
        } else if (info.errno == 3520) {  // 用户尚未注册
            wx.setStorageSync("openid", info.data.openid);
            success({isNeedRegister: true});
        } else if(info.errno == 3607) { // 用户尚未授权
            wx.setStorageSync("openid", info.data.openid);
            loginWithOpenId(loginParam, info.data.openid, success);
        } else {
          wx.showModal({
            title: '错误提示',
            showCancel: false,
            content: info.errmsg
          })
        }
        wx.hideLoading();
      })
    }
  })
}

/**
 * [loginWithOpenId 根据openid以及用户授权数据登录]
 * @param  {[Object]}   loginParam [登录参数]
 * @param  {[String]}   openId     [openid]
 * @param  {Function}   success    [成功的回掉]
 */
var loginWithOpenId = function(loginParam, openId, success = () =>{}) {
  wx.getUserInfo({
    withCredentials: true,
    success: res => {
      loginParam.openid = openId;
      loginParam.encryptedData = res.encryptedData;
      loginParam.iv = res.iv;
      console.log(loginParam);
      HttpService.POST(API_CONFIG.API_USER_LOGIN, loginParam).then(info => {
          if (info.errno == 0) {
              const {
                skey,
                uid
              } = info.data;
              wx.setStorage({
                key: 'passport',
                data: {
                  skey,
                  uid
                },
                success: () => {
                  success({
                    skey,
                    uid
                  });
                }
              });
          } else if (info.errno == 3520) {  // 用户尚未注册
              success({isNeedRegister: true});
          } else {
            wx.showModal({
              title: '错误提示',
              showCancel: false,
              content: info.errmsg
            });
        }
        wx.hideLoading();
      });
    }, 
    fail: res => {
      console.log(res);
    }
  });
}

/**
 * 注册
 * @param  {Function} success         [成功的回掉]
 * @param  {[type]}   encryptedMobile [加密手机号]
 * @param  {[type]}   iv4Mobile       [加密手机号的初始向量]
 */
var register = function(success = () => {}, encryptedMobile, iv4Mobile) {
  let openid = wx.getStorageSync("openid");
  wx.getUserInfo({
    withCredentials: true,
    success: res => {
      var _data = {
        appid: appId,
        encryptedData: res.encryptedData,
        iv: res.iv,
        openid,
        encryptedMobile,
        iv4Mobile,
        _platform_num
      };
      // console.log(_data);
      HttpService.POST(API_CONFIG.API_USER_REGISTER, _data).then(info => {
        wx.hideLoading();
        if (info.errno == 0) {
          const {
            skey,
            uid
          } = info.data;
          // console.log(info);
          wx.setStorage({
            key: 'passport',
            data: {
              skey,
              uid
            },
            success: () => {
              success({
                skey,
                uid
              })
            }
          });
        } else {
          wx.showModal({
            title: '错误提示',
            showCancel: false,
            content: info.errmsg
          });
        }
      })
    },
    fail: res => {
      console.log(res);
    }
  });
}

/**
 * 统一下单操作
 * @param {[Object]} prepayParam [预支付参数数据]
 * @param {[String]} sign        [签名]
 */
var UnifiedOrder = function(prepayParam, sign) {
  var formData = "<xml>";
  formData += "<appid>" + prepayParam['appid'] + "</appid>"; //appid
  formData += "<sub_appid>" + prepayParam['sub_appid'] + "</sub_appid>"; //sub_appid
  formData += "<sub_mch_id>" + prepayParam['sub_mch_id'] + "</sub_mch_id>"; //sub_appid
  formData += "<attach>" + prepayParam['attach'] + "</attach>"; //附加数据
  formData += "<body>" + prepayParam['body'] + "</body>"; //标题
  formData += "<mch_id>" + prepayParam['mch_id'] + "</mch_id>"; //商户号
  formData += "<nonce_str>" + prepayParam['nonce_str'] + "</nonce_str>"; //随机字符串，不长于32位。
  formData += "<notify_url>" + prepayParam['notify_url'] + "</notify_url>"; //异步接收微信支付结果通知的回调地址
  formData += "<sub_openid>" + prepayParam['sub_openid'] + "</sub_openid>"; //用户Id
  formData += "<out_trade_no>" + prepayParam['out_trade_no'] + "</out_trade_no>"; //商户订单号
  formData += "<spbill_create_ip>" + prepayParam['spbill_create_ip'] + "</spbill_create_ip>";
  formData += "<total_fee>" + prepayParam['total_fee'] + "</total_fee>"; //金额
  formData += "<trade_type>" + prepayParam['trade_type'] + "</trade_type>"; //公共号支付
  formData += "<sign>" + sign + "</sign>"; //签名
  formData += "</xml>";

  return HttpService.POST("https://api.mch.weixin.qq.com/pay/unifiedorder", formData);
}

/**
 * [createGiftCardOrder 创建礼品卡订单]
 * @param  {[Object]} orderData [下单数据]
 * @param  {[Object]} passport  [登录信息]
 */
var createGiftCardOrder = function(orderInfo, passport) {
  var _orderInfo = orderInfo.orderData;
  var cardValue = orderInfo.orderData.sku_total_price / (orderInfo.orderData.buy_count * 100);
  HttpService.POST(API_CONFIG.API_ORDER_CREATE, orderInfo.orderData).then(info => {
    if (info.code == 0) {
      var orderId = info.data.order_id;
      
      var paymentParam = {
        orderId,appId,partnerId,cardValue,
        poster: orderInfo.poster,
        cardNum: _orderInfo.buy_count
      };
      goPayment(paymentParam, passport);
    } else if (info.code == 310002) {
      delete _orderInfo.skey;
      delete _orderInfo.uid;
      wx.setStorageSync("orderInfo", orderInfo);
      login(createOrderWithLogin);
    } else {
      wx.showModal({
        title: '错误提示',
        showCancel: false,
        content: info.message
      });
    }
  });
}

/**
 * [重新登录去下单]
 * @param  {[Object]} passport [description]
 */
var createOrderWithLogin = passport => {
  let orderInfo = wx.getStorageSync("orderInfo");
  orderInfo.orderData.skey = passport.skey;
  orderInfo.orderData.uid = passport.uid;
  createGiftCardOrder(orderInfo, passport);
  wx.removeStorageSync("orderInfo");
}

/**
 * [goPayment 拉取支付]
 * @param  {[Object]} paymentParam [支付参数]
 * @param  {[Object]} passport     [登录信息]
 */
var goPayment = function(paymentParam, passport) {
  HttpService.POST(`${API_CONFIG.API_PAYMENT}?orderid=${paymentParam.orderId}&partnerid=${paymentParam.partnerId}&platformid=${_platform_num}&paytype=1&client=6&appid=${paymentParam.appId}`, passport).then(info => {
    if (info.errno == 0) {
      let data = {
        isBatch: false,
        orderId: paymentParam.orderId,
        modelPic: paymentParam.poster,
        cardNum: paymentParam.cardNum,
        cardValue: paymentParam.cardValue
      };
      wx.requestPayment({
        ...info.data,
        success: () => {
          wx.navigateTo({
            url: '../giveCard/giveCard?data=' + JSON.stringify(data)
          });
        },
        fail: obj => {
          if (obj && obj.errMsg == 'requestPayment:fail cancel') {
            // cancel(obj)
            console.log(obj.errMsg);
          } else {
            // fail(obj)
          }
        }
      })
    } else if(info.errno == 1024) {
      wx.setStorageSync("paymentParam", paymentParam);
      login(paymentWithLogin);
    } else {
      wx.showModal({
        title: '错误提示',
        showCancel: false,
        content: info.errmsg
      });
    }
  })
}

/**
 * [重新登录去支付]
 * @param  {[Object]} passport [description]
 */
var paymentWithLogin = passport => {
  let paymentParam = wx.getStorageSync("paymentParam");
  goPayment(paymentParam, passport);
  wx.removeStorageSync("paymentParam");
}

/**
 * [throttle 多次触发只会执行一次]
 * @param  {Function} fn      [回调]
 * @param  {[Long]}   gapTime [时间间隔]
 */
var throttle = function(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
        gapTime = 1500
    }
 
    let _lastTime = null
 
    // 返回新的函数
    return function () {
        let _nowTime = + new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments)   //将this和参数传给原函数
            _lastTime = _nowTime        
        }
    }
}

module.exports = {
  formatTime: formatTime,
  getNonceStr: getNonceStr,
  getCurrentTimeStamp: getCurrentTimeStamp,
  commonSign: commonSign,
  checkLogin: checkLogin,
  login: login,
  register: register,
  UnifiedOrder: UnifiedOrder,
  createGiftCardOrder: createGiftCardOrder,
  throttle: throttle
}
/**
 * 基础API请求地址
 * @type {string}
 */
const BASE_API = ''

/** [CARD_API 礼品卡接口] */
const CARD_API = ''

/** [PAYCODE_API 支付码接口] */
const PAYCODE_API = ''

/**
 * 请求数据的url
 */
module.exports = {
  // 首页数据
  API_CMS: BASE_API + '/cms/publish/998/config/100.json',
  // 商详接口
  API_DETAIL: BASE_API + '/item/item/commo2o',
  // 小程序登录接口
  API_USER_LOGIN: BASE_API + '/user/user/LoginbyWechatApplet',
  //  小程序登录接口
  API_USER_REGISTER: BASE_API + '/user/user/RegisterByWechatApplet',
  // 创建礼品卡订单接口
  API_ORDER_CREATE: BASE_API + '/vorder/vorder/CreateStoreCardVorderForWeChat',
  // 支付接口
  API_PAYMENT: BASE_API + '/pay/cashier/cashier_request.php',
  // 礼品卡列表查询接口
  API_CARD_LIST: CARD_API + '/queryCardsForUser.do',
  // 总余额查询接口
  API_CARD_BALANCE: CARD_API + '/queryBalance.do',
  // 赠送卡取消接口
  API_WITHDRAW_GIFT_CARD: CARD_API + '/withdrawGiving.do',
  // 批量赠送卡接口
  API_BATCH_GIFT_CARD: CARD_API + '/batchGiveCardToAnother.do',
  // 储值卡接受赠送接口
  API_RECEIVE_CARD: CARD_API + '/receiveCard.do',
  // 赠送中的卡信息查询接口
  API_GIFT_INFO: CARD_API + '/queryGiftInfo.do',
  // 礼品卡详情接口
  API_CARD_DETAIL: CARD_API + '/queryGroupCardInfo.do',
  // 根据订单号查询礼品卡信息
  API_QUERYCARD_BYORDERNO: CARD_API + '/queryCardByOrderNo.do',
  // 支付码接口
  API_PAY_CODE: PAYCODE_API + '/initPayCode.do',
  // 获取api_ticket的接口
  API_QUERY_APITICKET: 'https://mmc.retailo2o.com/wxxcx/api/wechat/getApiTicket.do'
}

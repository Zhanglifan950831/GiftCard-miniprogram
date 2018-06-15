/**
 * [BASE_API 基础API请求地址]
 * @type {String}
 */
const BASE_API = "https://sxcq.retailo2o.com";
const TEST_BASE_API = "http://10.254.0.161";

/** [CARD_API 礼品卡接口] */
const CARD_API = BASE_API + "/card";
const TEST_CARD_API = "http://10.254.1.154:8086/hzw-card-web/usercard";

/** [PAYCODE_API 支付码接口] */
const PAYCODE_API = BASE_API + "/scanpay";
const TEST_PAYCODE_API = "http://10.254.1.154:8088/scanpay-web/scanpay";

module.exports = {
    API_USER_LOGIN: BASE_API + "/user/user/LoginbyWechatApplet", // √.小程序登录接口
    API_USER_REGISTER: BASE_API + "/user/user/RegisterByWechatApplet", // √.小程序登录接口
    // API_CMS: TEST_BASE_API + "/cms/publish/998/config/100.json", // √.多租户CMS接口
    API_CMS: BASE_API + "/cms/publish/998/channel/230.json", // √.多租户CMS接口
    API_DETAIL: BASE_API +"/item/item/commo2o", // √.多租户商详接口
    API_ORDER_CREATE: BASE_API + "/vorder/vorder/CreateStoreCardVorderForWeChat", //√.创建礼品卡订单接口
    API_PAYMENT: BASE_API + "/pay/cashier/cashier_request.php",   // √.支付接口
    API_ORDER_CANCEL: BASE_API + "/vorder/CancelVorder", // 取消订单接口
    API_ORDER_DETAIL: BASE_API + "/vorder/Getvorderdetail", // 订单详情接口
    API_PAY_CODE: PAYCODE_API + "/initPayCode.do", // √.支付码接口

    API_CARD_LIST: CARD_API + "/queryCardsForUser.do",    // √.礼品卡列表查询接口
    API_CARD_BALANCE: CARD_API + "/queryBalance.do",    // √.总余额查询接口
    API_GIFT_CARD: CARD_API + "/giveCardToAnother.do", // √.卡赠送接口（已废弃） 
    API_WITHDRAW_GIFT_CARD: CARD_API + "/withdrawGiving.do", // √. 赠送卡取消接口 
    API_BATCH_GIFT_CARD: CARD_API + "/batchGiveCardToAnother.do", // √.批量赠送卡接口
    API_RECEIVE_CARD: CARD_API + "/receiveCard.do", // √.储值卡接受赠送接口
    API_GIFT_INFO: CARD_API + "/queryGiftInfo.do", // √.赠送中的卡信息查询接口
    API_CARD_DETAIL:CARD_API + "/queryGroupCardInfo.do", // √.礼品卡详情接口
}
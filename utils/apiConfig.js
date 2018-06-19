/**
 * [BASE_API 基础API请求地址]
 * @type {String}
 */
const TEST_BASE_API = "http://10.254.0.161";

/** [CARD_API 礼品卡接口] */
const TEST_CARD_API = "http://10.254.1.154:8086/hzw-card-web/usercard";

/** [PAYCODE_API 支付码接口] */
const TEST_PAYCODE_API = "http://10.254.1.154:8088/scanpay-web/scanpay";

module.exports = {
    API_USER_LOGIN: TEST_BASE_API + "/user/user/LoginbyWechatApplet", // √.小程序登录接口
    API_USER_REGISTER: TEST_BASE_API + "/user/user/RegisterByWechatApplet", // √.小程序登录接口
    API_CMS: TEST_BASE_API + "/cms/publish/998/config/100.json", // √.多租户CMS接口
    // API_CMS: BASE_API + "/cms/publish/998/channel/230.json", // √.多租户CMS接口
    API_DETAIL: TEST_BASE_API +"/item/item/commo2o", // √.多租户商详接口
    API_ORDER_CREATE: TEST_BASE_API + "/vorder/vorder/CreateStoreCardVorderForWeChat", //√.创建礼品卡订单接口
    API_PAYMENT: TEST_BASE_API + "/pay/cashier/cashier_request.php",   // √.支付接口
    API_ORDER_CANCEL: TEST_BASE_API + "/vorder/CancelVorder", // 取消订单接口
    API_ORDER_DETAIL: TEST_BASE_API + "/vorder/Getvorderdetail", // 订单详情接口
    API_PAY_CODE: TEST_PAYCODE_API + "/initPayCode.do", // √.支付码接口

    API_CARD_LIST: TEST_CARD_API + "/queryCardsForUser.do",    // √.礼品卡列表查询接口
    API_CARD_BALANCE: TEST_CARD_API + "/queryBalance.do",    // √.总余额查询接口
    API_GIFT_CARD: TEST_CARD_API + "/giveCardToAnother.do", // √.卡赠送接口（已废弃） 
    API_WITHDRAW_GIFT_CARD: TEST_CARD_API + "/withdrawGiving.do", // √. 赠送卡取消接口 
    API_BATCH_GIFT_CARD: TEST_CARD_API + "/batchGiveCardToAnother.do", // √.批量赠送卡接口
    API_RECEIVE_CARD: TEST_CARD_API + "/receiveCard.do", // √.储值卡接受赠送接口
    API_GIFT_INFO: TEST_CARD_API + "/queryGiftInfo.do", // √.赠送中的卡信息查询接口
    API_CARD_DETAIL:TEST_CARD_API + "/queryGroupCardInfo.do", // √.礼品卡详情接口
}
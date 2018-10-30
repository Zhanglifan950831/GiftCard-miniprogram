import sha1 from 'js-sha1'

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

/**
 * 获取当前时间戳
 * @return {[long]} [当前时间戳]
 */
var getCurrentTimeStamp = function () {
  return Date.parse(new Date()) / 1000
}

/**
 * 获取随机字符串
 * @return {[String]} [随机字符串]
 */
var getNonceStr = function (num = 32) {
  let rangArr = [{
    startIdx: 0, /** 起始位 */
    endIdx: 9 /** 结束位 */
  }, {
    startIdx: 65,
    endIdx: 90
  }, {
    startIdx: 97,
    endIdx: 122
  }]
  let strArr = []
  let nonceStr = ''

  /**
   * 创建字符串数组
   * @param  {[Object]} item [循环项目]
   * @param  {[Integer]} idx) {                   for (var i [description]
   * @return {[Array]}      [字符串数组]
   */
  rangArr.forEach(function (item, idx) {
    for (var i = item.startIdx; i <= item.endIdx; i++) {
      var _str = i.toString()
      if (idx > 0) {
        _str = String.fromCharCode(i)
      }
      strArr.push(_str)
    }
  })

  for (var i = 0; i < num; i++) {
    var _index = Math.floor(Math.random() * strArr.length)
    nonceStr += strArr[_index]
  }
  return nonceStr
}

/**
 * 添加微信卡包
 * @param cardList  卡列表
 * @param success 成功的回调
 */
var wxAddCard = function (cardList, success = () => {}) {
  /**
   * 调用微信卡券接口时签名的临时票据
   * @type {string}
   */
  let apiTicket = ''
  let openid = ''
  let _cardList = []
  cardList.forEach((item) => {
    let timeStamp = getCurrentTimeStamp()
    let cardId = item.cardId
    let code = item.code
    let nonceStr = getNonceStr()
    let signArr = [timeStamp.toString(), code.toString(), cardId, nonceStr, openid, apiTicket]
    signArr.sort()
    let cardExtObj = {
      code,
      openid,
      timestamp: timeStamp,
      nonce_str: nonceStr,
      signature: sha1(signArr.join(''))
    }
    _cardList.push({
      cardId,
      cardExt: JSON.stringify(cardExtObj)
    })
  })
  wx.addCard({
    cardList: _cardList,
    success: res => {
      console.log(res)
      success()
    },
    fail: res => {
      console.log('添加卡包失败返回信息：' + JSON.stringify(res))
    }
  })
}

export default {
  formatNumber,
  formatTime,
  getCurrentTimeStamp,
  getNonceStr,
  wxAddCard
}

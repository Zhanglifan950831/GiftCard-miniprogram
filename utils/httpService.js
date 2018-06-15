/**
 * GET请求
 * @param {[String]} requestUrl [请求地址]
 * @param {[Object]} param      [参数数据]
 */
const GET = function (requestUrl, param) {
    return new Promise(function(resolve) {
        wx.request({
          url: requestUrl,
          data: param,
          header: {"Content-Type": "application/x-www-form-urlencoded"},
          success: function (res) {
            resolve(res.data);
          }
        });
    });
}

/**
 * POST请求
 * @param {[String]} requestUrl [请求地址]
 * @param {[Object]} data       [提交数据]
 */
const POST = function (requestUrl, data, header = {"Content-Type": "application/x-www-form-urlencoded"}) {
    return new Promise(function(resolve) {
        wx.request({
          url: requestUrl,
          data: data,
          method: "POST",
          header,
          success: function (res) {
            resolve(res.data);
          }
        });
    });
}

const POP = function(requestUrl, data) {
  let paramArr = [];
  for (var key in data) {
    paramArr.push(key + "=" + data[key]);
  };
  let _requestUrl = paramArr.length > 0 ? requestUrl + "?" + paramArr.join("&") : requestUrl;
  return new Promise(function(resolve) {
      wx.request({
        url: _requestUrl,
        data: {},
        method: "POST",
        header: {"Content-Type": "application/json"},
        success: function (res) {
          resolve(res.data);
        }
      });
  });
}

module.exports = {
    GET: GET,
    POST: POST,
    POP: POP
}
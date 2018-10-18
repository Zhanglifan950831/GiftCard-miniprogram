import Fly from 'flyio/dist/npm/wx'

const fly = new Fly()

/**
 * GET请求封装
 * @param requestUrl  请求地址
 * @param param 参数
 * @returns {Promise<FlyResponse<any>>}
 * @constructor
 */
const GET = (requestUrl, param = {}) => {
  return fly.get(requestUrl, param).then(res => {
    return res.data
  })
}

/**
 * POST请求
 * @param requestUrl  请求地址
 * @param data  提交数据
 * @param header  请求头信息
 * @returns {Promise<FlyResponse<any>>}
 * @constructor
 */
const POST = (requestUrl, data, header = {'Content-Type': 'application/x-www-form-urlencoded'}) => {
  return fly.post(requestUrl, data, {headers: header}).then(res => {
    return res.data
  })
}

export default {
  GET,
  POST
}

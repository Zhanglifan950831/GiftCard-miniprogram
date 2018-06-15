/**
 * 通用二维码和条形码生成
 * @authors zhang.lifan
 * @date    2018-05-28 11:08:42
 * @version 1.0.0
 */

import QRCODE from "./lib/qrcode"
import BARCODE from "./lib/barcode"

var convert_length = function(length) {
    return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

/**
 * [qrcode 生成二维码]
 * @param  {[String]} code     [二维码内容]
 * @param  {[String]} canvasId [canvasId]
 * @param  {[Number]} width    [宽度]
 * @param  {[Number]} height   [高度]
 */
var qrcode = function (code, canvasId, width, height) {
    return QRCODE.api.draw(code, canvasId, convert_length(width), convert_length(height));
}

/**
 * [barcode 生成条形码]
 * @param  {[String]} code     [条形码内容]
 * @param  {[String]} canvasId [canvasId]
 * @param  {[Number]} width    [宽度]
 * @param  {[Number]} height   [高度]
 */
var barcode = function (code, canvasId, width, height) {
    return BARCODE.code128(wx.createCanvasContext(canvasId), code, convert_length(width), convert_length(height));
}

module.exports = {
    qrcode: qrcode,
    barcode: barcode
}
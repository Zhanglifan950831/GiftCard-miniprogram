//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    /*wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })*/
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } 
      }
    })
  },
  onShow: function(opt) {
    if (opt && opt.scene) {
        let _scene = opt.scene;
        if (_scene == 1007) {
            wx.setStorageSync("isChatRoom", 0);
            console.log("----------------------------------------");
            console.log("【转发给个人】");
            console.log("----------------------------------------");
        } 
        if (_scene == 1008) {
            wx.setStorageSync("isChatRoom", 1);
            console.log("----------------------------------------");
            console.log("【转发给群】");
            console.log("----------------------------------------");
        }
    }
    if (opt && opt.referrerInfo) {
      const {uid, skey} = opt.referrerInfo.extraData;
      wx.setStorageSync("passport", {uid, skey});
    }
  },
  globalData: {
    userInfo: null,
    appId: "wx4553b7a1465a6c9d",
    AppSecret:"694247db6dd618747491883d45f28cab",
    _platform_num: 6,
    wxPubId: 1,
    key: "ab02a3f4a1d14fc8b997c3377be0379b",
    mch_id: "1244007002",
    sub_appid: "wx39eef238730a2c7e",
    sub_mch_id: "1494460862",
    callback: null
  }
})
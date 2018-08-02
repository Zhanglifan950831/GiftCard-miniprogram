import {register} from "../../utils/util"
import HttpService from "../../utils/httpService";
import API_CONFIG from "../../utils/apiConfig"
const app = getApp();

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    isShow: {
      type: Boolean,
      value: true
    },
    module: {
      type: String,
      value: ""
    }
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    closeModal: function() {
      this.setData({
        isShow: false
      });
    },
    getUserinfo: function(e) {
      let _info = e.detail;
      var module = this.properties.module
      this.closeModal();
      if (_info.userInfo) {
        /** 设置用户信息缓存  */
        wx.setStorageSync("userInfo", _info.userInfo);
        this.triggerEvent("myEvent", {type: "login"});
      } else {
        setTimeout(function() {
          wx.showToast({
            title: "您取消授权了",
            icon: "none"
          });
        }, 500);
      }
    }
  }
})
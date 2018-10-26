<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  /*align-items: center;*/
  justify-content: space-between;
  /*padding: 100px 0;*/
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}

button {
  border:none;
}

button::after{
  border:none;
}

/** 遮罩 */
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
}
.layer-box {
  border-radius: 10px;
  background-color: #fff;
  width: 285px;
  box-sizing: border-box;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 15px 40px;
  color: #333;
  font-size: 14px;
  text-align: center;
  z-index: 10000;
}
</style>

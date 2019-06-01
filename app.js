var user = require('./common/user.js');
App({
  onLaunch: function () {
      //隐藏自带的导航栏
      wx.hideTabBar();
      //检查用户状态
      user.checkUserInfo();
  },
  globalData: {
    userInfo: null
  }
})
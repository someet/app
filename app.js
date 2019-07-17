var user = require('./common/user.js');
App({
	globalData:{
        apiUrl: 'http://dubin.ngrok.wdevelop.cn',
				userInfo: null
	},
  onLaunch: function () {
      //隐藏自带的导航栏
      wx.hideTabBar();
      //检查用户状态
      user.checkUserInfo();
  },
	showMsg(msg,type,duration){
		var icon = typeof(type) == 'undefined'?'none':type
		var t = typeof(duration) == 'undefined'?2000:duration
		wx.showToast({
				title: msg,
				icon: icon,
				duration: 2000
		})
	},
	loadMsg(){
		wx.showLoading({
			title: '正在努力加载...',
		})
	},
	hideLoad(){
		wx.hideLoading()
	}
})
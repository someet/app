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
		var t = '正在努力加载...';
		wx.showLoading({
			title: t,
		})
	},
	loadTitle(title){
		var t = typeof(title) == undefined?'正在努力加载...':title;
		wx.showLoading({
			title: t,
		})
	},
	hideLoad(){
		wx.hideLoading()
	}
})
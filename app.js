var user = require('./common/user.js');
App({
	globalData:{
        apiUrl: 'http://mac.ngrok.wdevelop.cn',
		userInfo: null,
		isIphoneX:false
	},
	onLaunch: function () {
		var that = this;
	  //隐藏自带的导航栏
	  wx.hideTabBar();
	  //检查用户状态
	  user.checkUserInfo();
	  wx.removeStorageSync('editFrom')
	  var res = this.getDeviceInfo()　
	  var radio = 1;
	  if(res.screenWidth && res.screenHeight){
		  radio = res.screenHeight/res.screenWidth;
		  if(radio > 1.8){
			  that.globalData.isIphoneX = true
		  }
	  }
	  console.log(that.globalData.isIphoneX)
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
		var t = typeof(title) == 'undefined'?'正在努力加载...':title;
		wx.showLoading({
			title: t,
		})
	},
	hideLoad(){
		wx.hideLoading()
	},
	getWindowInfo(){
		var client = wx.getSystemInfoSync();
		return client;
	},
	getDeviceInfo(){
		try {
		  const res = wx.getSystemInfoSync()
		  wx.setStorageSync('deviceInfo',res);
		  // that.globalData.isIphoneX = true
		  return res;
		} catch (e) {
		  // Do something when catch error
		}
	}
})
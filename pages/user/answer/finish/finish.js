var req = require('../../../../common/request.js');
var app = getApp()
Page({
	data: {
		screenHeight:0
	},
	onLoad(){
		var that = this
		// 获取屏幕高度
		wx.getSystemInfo({
			success (res) {
				that.setData({
					screenHeight:(res.windowHeight - res.statusBarHeight - 48 - 32 - 48)/2
				})
				console.log(that.data.screenHeight)
			}
		})
	},
	//返回首页
	goIndex(){
		wx.switchTab({
		  url: '/pages/index/index'
		})
	}
})
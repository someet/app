var user = require('../../../common/user.js');
var imageUtil = require('../../../utils/util.js');
var req = require('../../../common/request.js');
var user = require('../../../common/user.js');
var util = require('../../../utils/util.js'); 
var app = getApp()
Page({
	data:{
		scrollHeight:0
	},
	onLoad(){
		var client = wx.getSystemInfoSync();
		var clientHeight = client.windowWidth;
		this.setData({
			scrollHeight:clientHeight
		})
	}
})
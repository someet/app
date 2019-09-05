var user = require('../../../common/user.js');
var imageUtil = require('../../../utils/util.js');
var req = require('../../../common/request.js');
var user = require('../../../common/user.js');
var util = require('../../../utils/util.js'); 
var app = getApp()
Page({
	data:{
		scrollHeight:0,
		userInfo:{},
		id:0
	},
	onLoad(options){
		var client = wx.getSystemInfoSync();
		var clientHeight = client.windowWidth;
		var id;
		id = typeof(options.id) == 'undefined' ? 0:options.id
		this.setData({
			scrollHeight:clientHeight,
			id:id
		})
		console.log(this.data.id)
		this.getInfo()
	},
	//获取我的跟人信息
	getInfo(){
		const that = this
		req.getInfo(this.data.id).then((res)=>{
			console.log(res.data.data)
			that.setData({
				userInfo:res.data.data
			})
		})
	},
	goEdit(){
		wx.navigateTo({
			url:'./edit/edit'
		})
	}
})
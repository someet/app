var user = require('../../../../common/user.js');
var imageUtil = require('../../../../utils/util.js');
var req = require('../../../../common/request.js');
var user = require('../../../../common/user.js');
var util = require('../../../../utils/util.js'); 
var app = getApp()
Page({
	data:{
		id:0,
		tagType:'zy'
	},
	onLoad(options){
		const that = this
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('tagType', function(data){
			console.log(data)
			that.setData({
				tagType:data.data
			})
		});
	},
	confirmSub(){
		//返回上层并传值
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.emit('imgIndex', {data: '123',type:'zy'});
		wx.navigateBack({
		  delta: 1
		})
	}
})
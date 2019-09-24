var user = require('../../../../common/user.js');
var imageUtil = require('../../../../utils/util.js');
var req = require('../../../../common/request.js');
var user = require('../../../../common/user.js');
var util = require('../../../../utils/util.js'); 
var app = getApp()
Page({
	data:{
		scrollHeight:0,
		userInfo:{},
		id:0,
		my_head_img_1:'',
		my_head_img_2:'',
		my_head_img_3:''
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
		//接收修改后的返回值
		const eventChannel = this.getOpenerEventChannel()
		eventChannel.on('tagType', function(data){
			console.log(data)
		});
		this.getInfo()
	},
	//获取我的跟人信息
	getInfo(){
		const that = this
		console.log(this.data.id)
		req.getInfo(this.data.id).then((res)=>{
			console.log(res.data.data)
			that.setData({
				userInfo:res.data.data
			})
		})
	},
	// 点击更改进入标签页
	editTags(e){
		const type = e.currentTarget.dataset.type,that = this
		wx.navigateTo({
			url:'/pages/user/info/edit/tags',
			events:{
				changeTags(data){
					console.log(data)
				}
			},
			success(res){
				res.eventChannel.emit('tagType',{data:type})
			}
		})
	},
	// 上传图片
	uploadImg(e){
		var type = e.currentTarget.dataset.id,that = this
		wx.navigateTo({
			url:'/pages/components/upload/upload',
			events: {
				// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
				imgIndex: function(data) {
				  console.log(data)
				  if(data.type == 'my_head_img_1'){
					  that.setData({
						  my_head_img_1:data.data
					  })
				  }
				  if(data.type == 'my_head_img_2'){
					  that.setData({
						  my_head_img_2:data.data
					  })
				  }
				  if(data.type == 'my_head_img_3'){
					  that.setData({
						  my_head_img_3:data.data
					  })
				  }
				}
			},
			success(res){
				res.eventChannel.emit('imgIndex', { data: type })
			}
		})
	}
})
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
		my_head_img_3:'',
		zy:{},
		grsx:{},
		rstd:{},
		tsjl:{},
		ph:{},
		tsjn:{},
		myUga:{}
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
		this.getInfo()
	},
	//获取我的跟人信息
	getInfo(){
		const that = this
		console.log(this.data.id)
		req.getInfo(this.data.id).then((res)=>{
			console.log(res.data.data)
			that.setData({
				userInfo:res.data.data,
				zy:res.data.data.usertags.zy,
				grsx:res.data.data.usertags.grsx,
				rstd:res.data.data.usertags.rstd,
				tsjl:res.data.data.usertags.tsjl,
				ph:res.data.data.usertags.ph,
				tsjn:res.data.data.usertags.tsjn,
				myUga:res.data.data.uga
			})
		})
	},
	// 点击更改进入标签页
	editTags(e){
		const type = e.currentTarget.dataset.type,that = this
		wx.navigateTo({
			url:'/pages/user/info/edit/tags',
			events:{
				//接收修改后的返回值
				tagType:function(res){
					console.log(res)
					switch(res.type){
						case "1":
							that.setData({
								zy:res.data
							})
						break;
						case "2":
							that.setData({
								tsjn:res.data
							})
						break;
						case "3":
							that.setData({
								grsx:res.data
							})
						break;
						case "4":
							that.setData({
								tsjl:res.data
							})
						break;
						case "5":
							that.setData({
								rstd:res.data
							})
						break;
						case "6":
							that.setData({
								ph:res.data
							})
						break;
					}
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
	},
	//删除uga问题
	delUgaAnswer(e){
		var delId = e.currentTarget.dataset.id,that = this,index = e.currentTarget.dataset.index
		wx.showModal({
			  title: '删除提示',
			  content: '确定要删除吗?',
			  success (res) {
				if (res.confirm) {
				  req.delUgaAnswer({'id':delId}).then((res)=>{
				  	console.log(index)
				  	var data = res.data
					var myUga = that.data.myUga
				  	if(data.status == 1){
						myUga.splice(index,1)
						that.setData({
							myUga:myUga
						})
				  		app.showMsg('删除已完成');
				  	}
				  })
				} else if (res.cancel) {
				  console.log('用户点击取消')
				}
			  }
		})
	},
	// 跳转添加问题
	goAddUga(e){
		var id = e.currentTarget.dataset.id
		var type = e.currentTarget.dataset.type
		var that = this
		wx.navigateTo({
			url:'/pages/user/info/edit/addUga',
			events:{
				changeUgaById(data){
					var myUga = that.data.myUga
					console.log(data)
					for (let row in myUga) {
						if(data.id == myUga[row].id){
							myUga[row].uga_answer = data.uga_answer
							console.log(data.uga_answer)
							console.log('-----')
							console.log(myUga[row].uga_answer)
							that.setData({
								myUga:myUga
							})
							return
						}else{
							myUga = [...that.data.myUga,data];
							console.log(myUga)
							that.setData({
								myUga:myUga
							})
							console.log(that.data.myUga)
							return 
						}
					}
				}
			},
			success(res){
				res.eventChannel.emit('editUgaIndex', { 'type': type,'id':id })
			}
		})
	}
})
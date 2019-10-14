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
		myUga:{},
		editFrom:'',
		id:0
	},
	onLoad(options){
		var client = wx.getSystemInfoSync();
		var clientHeight = client.windowWidth;
		var id,that = this;
		//从哪跳转到修改信息也
		// eidtFrom
		// const eventChannel = that.getOpenerEventChannel()
		// eventChannel.on('editUserFrom', function(data){
		// 	console.log(data)
		// 	that.setData({
		// 		editFrom:data.from,
		// 		id:id
		// 	})
		// });
		var fromInfo = wx.getStorageSync('editUserFrom')
		console.log((fromInfo.fromPage && fromInfo.id))
		if(fromInfo.fromPage && fromInfo.id){
			that.setData({
				editFrom:fromInfo,
				id:fromInfo.id
			})
		}
		console.log(this.data.editFrom)
		var checkInfo = wx.getStorageSync('userInfo')
		id = checkInfo.id
		this.setData({
			scrollHeight:clientHeight,
			id:id
		})
		this.getInfo()
		user.checkUserInfoComplete()
	},
	//获取我的跟人信息
	getInfo(){
		const that = this
		app.loadTitle('获取信息中...')
		req.getInfo(this.data.id).then((res)=>{
			var userData = res.data.data
			var album = userData.album
			that.setData({
				userInfo:userData,
				zy:userData.usertags.zy,
				grsx:userData.usertags.grsx,
				rstd:userData.usertags.rstd,
				tsjl:userData.usertags.tsjl,
				ph:userData.usertags.ph,
				tsjn:userData.usertags.tsjn,
				myUga:userData.uga,
				my_head_img_1:album[0],
				my_head_img_2:album[1],
				my_head_img_3:album[2]
			})
			app.hideLoad()
			var userInfoComplete = wx.getStorageSync('userInfoComplete')
			if(userInfoComplete == 'tags'){
				app.showMsg('请先完善标签信息')
			}else if(userInfoComplete == 'uga'){
				app.showMsg('请先完善uga问题')
			}else if(userInfoComplete == 'baseInfo'){
				app.showMsg('请先完善基本信息')
			}
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
				res.eventChannel.emit('uploadType', { type: 'profile' })
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
	},
	goUserEdit(){
		var that = this
		var fromData;
		if(that.data.editFrom && that.data.editFrom.fromPage == 'act'){
			fromData = {
				'fromPage':'act',
				'id':that.data.id
			}
		}else{
			fromData = { 'fromPage':'profile','userInfo':that.data.userInfo },
			wx.setStorageSync('editUserFrom', fromData)
		}
		wx.navigateTo({
			url:'/pages/user/info/edit/useredit',
			events:{
				changeMyName(data){
					console.log(data)
				}
			},
			success(res){
				res.eventChannel.emit('editUserFrom', fromData)
			}
		})
	},
	//完场
	completeUser(){
		var editFrom = wx.getStorageSync('editFrom'),url;
		if(editFrom && editFrom == 'act'){
			url = '/pages/detail/detail?id='+editFrom.id
		}else{
			url = '/pages/user/info/info'
		}
		wx.redirectTo(({
			url:url
		}))
	},
	goBack(){
		wx.navigateBack({
		  delta: 1
		})
	}
})
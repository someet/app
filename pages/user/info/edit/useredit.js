var user = require('../../../../common/user.js');
var imageUtil = require('../../../../utils/util.js');
var req = require('../../../../common/request.js');
var user = require('../../../../common/user.js');
var util = require('../../../../utils/util.js'); 
var app = getApp()
Page({
	data:{
		id:0,
		editFrom:'profile',
		headImgUrl:'',
		nickName:'',
		wechat_id:'',
		mobile:'',
		sex:'',
		birthDay:'',
		diyPhone:0
	},
	onLoad(options){
		const that = this
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('editUserFrom', function(data){
			console.log(data)
			that.setData({
				editFrom:data.from
			})
		});
		this.getUserInfo()
	},
	isSendCode(){
		this.setData({
			diyPhone:1
		})
	},
	// 获取个人信息
	getUserInfo(){
		req.getBaseInfo(0).then((res)=>{
			console.log(res)
		})
	},
	// 上传图片
	uploadImg(e){
		var type = e.currentTarget.dataset.id,that = this
		wx.navigateTo({
			url:'/pages/components/upload/upload',
			events: {
				// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
				changeHeadImg: function(data) {
				  console.log(data)
				}
			},
			success(res){
				res.eventChannel.emit('uploadType', { type:'headImg' })
			}
		})
	},
	// 快速获取手机号,需要先登录获取session 去解密{"session_key":"q5O0A8UnOalVk9kyGqShbw==","openid":"oeO-H5Cc3aHFfO10ZhtZWS1oS4rU","unionid":"o28P7ww3frRs9FoLRqbmr_EVKuxg"}
	getPhoneNumber(e){
		//sessionkey
		var session = wx.getStorageSync('session'),that = this;
		var sessionkey = session.session_key;
		if(!sessionkey){
			user.checkUserInfo()
			app.showMsg('请稍后');
		}else{
			app.loadTitle('正在获取...')
			e.detail.sessionKey = sessionkey;
			req.getPhoneNumber(e.detail).then((res)=>{
				console.log(e.detail)
				console.log(res)
				if(res.data.status == 1){
					var data = res.data.data
					that.setData({
						mobile:data.phoneNumber,
						diyPhone:0
					})
				}
				console.log(that.data.mobile)
				app.hideLoad()
			})
		}
		
	}
})
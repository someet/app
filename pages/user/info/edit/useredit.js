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
		username:'',
		wechat_id:'',
		mobile:'',
		sex:'3',
		birthDay:'',
		bio:'',
		diyPhone:0,
		isSave:0
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
		const that = this
		req.getBaseInfo(0).then((res)=>{
			console.log(res)
			var data = res.data.data
			that.setData({
				editFrom:data.from,
				headImgUrl:data.profile.headimgurl,
				username:data.username,
				wechat_id:data.wechat_id,
				mobile:data.mobile,
				birthDay:data.profile.birth_year+'-'+data.profile.birth_month+'-'+data.profile.birth_day,
				bio:data.profile.bio
			})
		})
	},
	changeSex(e){
		const that = this
		var data = e.currentTarget.dataset
		this.setData({
			sex:data.sex
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
				  that.setData({
					  headImgUrl:data.data
				  })
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
		
	},
	//提价用户信息
	userInfoSubmit(e){
		console.log(e.detail.value)
		this.setData({
			isSave:1
		})
		var that = this
		req.saveUserInfo(e.detail.value).then((res)=>{
			console.log(res)
			// app.showMsg('保存成功')
			// that.setData({
			// 	isSave:1
			// })
			// wx.redirectTo({'url':'/pages/user/info/info'})
		})
	},
	//日期选择
	bindDateChange(e){
		console.log(e.detail.value)
		this.setData({
			birthDay:e.detail.value
		})
	}
})
var userFunc = require('../../../../common/user.js');
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
		var checkInfo = wx.getStorageSync('userInfo')
		var id = checkInfo.id
		const eventChannel = that.getOpenerEventChannel()
		//保存是否从活动报名提醒完善信息过来，详情页可能是 跳转而不是二级页面，暂时不用 
		eventChannel.on('editUserFrom', function(data){
			console.log(data)
			that.setData({
				editFrom:data.from,
				id:id
			})
			if(!wx.getStorageSync('editUserFrom')){
				wx.setStorageSync('editUserFrom', data)
			}
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
		app.loadTitle('正在保存...')
		req.getBaseInfo(0).then((res)=>{
			console.log(res)
			app.hideLoad()
			var data = res.data.data
			var birth
			if(!data.profile.birth_year || !data.profile.birth_month || !data.profile.birth_day) {
				birth = '';
			}else{
				birth = data.profile.birth_year+'-'+data.profile.birth_month+'-'+data.profile.birth_day
			}
			
			that.setData({
				editFrom:data.from,
				headImgUrl:data.profile.headimgurl,
				username:data.username,
				wechat_id:data.wechat_id,
				mobile:data.mobile,
				birthDay:birth,
				bio:data.profile.bio
			})
			console.log(this.data.wechat_id)
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
		app.loadTitle('正在保存...')
		console.log(e.detail.value)
		this.setData({
			isSave:1
		})
		var that = this
		req.saveUserInfo(e.detail.value).then((res)=>{
			console.log(res)
			app.hideLoad()
			app.showMsg('保存成功')
			that.setData({
				isSave:1
			})
			//设置完成用户是否完善信息
			var userInfo = userFunc.getUserInfo();
			user.wechat_id = e.detail.value.wechat_id;
			userInfo.mobile = e.detail.value.mobile
			userFunc.setUserInfo(userInfo);
			//检查是否是报名活动完善信息
			var userInfoComplete = userFunc.checkUserInfoComplete();
			if(userInfoComplete){
				// 检查是否是从活动报名过lai/
				var userFrom = wx.getStorageSync('editUserFrom')
				if(userFrom == 'act'){
					//跳转到活动页面之前删除保存的from 信息
					wx.removeStorageSync('editFrom')
					wx.redirectTo({
						url:'/pages/details.detail?id='+userFrom.id
					})
				}
			}
			console.log(userFunc.getUserInfo())
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
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
		isSave:0,
		timeLeft:60,
		isSendCode:false,
		sendCodeText:'获取验证码',
		verifyCode:0,
		sendToken:false
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
				editFrom:data.fromPage,
				id:id
			})
			if(!wx.getStorageSync('editUserFrom')){
				wx.setStorageSync('editUserFrom', data)
			}
		});
		this.getUserInfo()
	},
	inputVerifyCode(e){
		this.setData({
			inputVerifyCode:e.detail.value
		})
	},
	isSendCode(e){
		this.setData({
			diyPhone:1,
			mobile:e.detail.value
		})
	},
	//获取验证码
	getVerifyCode(e){
		var data = e.detail.mcode;
		var that = this
		if(this.data.isSendCode){
			return false;
		}else{
			this.setData({
				isSendCode:true,
				sendToken:true
			})
			//发送验证码
			req.getVerifyCode({'mobile':this.data.mobile}).then((res)=>{
				console.log(res)
				if(res.data.status == 1){
					app.showMsg('发送成功')
					// that.setData({
					// 	sendCode:res.data.code
					// })
					var data = {
						time:new Date()/1000,
						verifyCode:res.data.code
					}
					wx.setStorageSync('verifyData', data)
				}else{
					app.showMsg(res.data.data);
				}
			})
		}
		var pro = new Promise((resolve,reject)=>{
			let timer = setInterval(function(){
				var timeLeft = that.data.timeLeft
				if(timeLeft <= 1){
					resolve(timer)
				}
				timeLeft--
				that.setData({
					timeLeft:timeLeft,
					isSendCode:true,
					sendCodeText:timeLeft+'s'
				})
			},1000);
		})
		pro.then((timer)=>{
			clearInterval(timer);
			that.setData({
				isSendCode:false,
				timeLeft:60,
				sendCodeText:'重新获取'
			})
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
				editFrom:data.fromPage,
				headImgUrl:data.profile.headimgurl,
				username:data.username,
				wechat_id:data.wechat_id,
				mobile:data.mobile,
				birthDay:birth,
				bio:data.profile.bio,
				sex:data.profile.sex
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
		this.setData({
			isSave:1
		})
		var that = this
		if(!this.data.mobile || !(/^1[2|3|4|5|6|7|8|9][0-9]\d{8}$$/.test(this.data.mobile))){
			app.showMsg('请检查手机号')
			that.setData({
				isSave:0
			})
			return false;
		}
		if((!this.data.inputVerifyCode || this.data.inputVerifyCode.length !=6) && this.data.diyPhone != 0){
			app.showMsg('请检查验证码')
			that.setData({
				isSave:0
			})
			return false;
		}
		var verifyData= wx.getStorageSync('verifyData')
		if(verifyData.verifyCode && verifyData.verifyCode != this.data.inputVerifyCode){
			app.showMsg('验证码不正确')
			that.setData({
				isSave:0
			})
			return false;
		}
		//判断验证码是否正确
		if(this.data.sendToken){
			req.verifyCode({'mobile':this.data.mobile,'verify_m_code':this.data.inputVerifyCode}).then((res)=>{
				if(res.data.status == 1){
					console.log(11111111)
					app.loadTitle('正在保存...')
					wx.removeStorageSync('verifyData')
					
					return req.saveUserInfo(e.detail.value);
				}else if(res.data.status == -1){
					app.showMsg(res.data.data)
					that.setData({
						isSave:0
					})
					return false;
				}else{
					app.showMsg('验证码验证失败')
					that.setData({
						isSave:0
					})
					return false;
				}
			}).then((res)=>{
				app.hideLoad()
				that.setData({
					isSave:0
				})
				if(res == false) return false;
				app.showMsg('保存成功')
				that.reqComplete(res,e)
			})
		}else{
			req.saveUserInfo(e.detail.value).then((res)=>{
				app.hideLoad()
				that.setData({
					isSave:0
				})
				if(res == false) return false;
				app.showMsg('保存成功')
				that.reqComplete(res,e)
			})
		}
	},
	reqComplete(res,e){
		userFunc.checkUserInfoComplete()
		//设置完成用户是否完善信息
		// userInfo.profile.birth_year = 
		userFunc.setUserInfoByUnionId();
		//检查是否是报名活动完善信息
		var userInfoComplete = userFunc.checkUserInfoComplete();
		if(userInfoComplete == 'complete'){
			// 检查是否是从活动报名过lai/
			var userFrom = wx.getStorageSync('editUserFrom')
			if(userFrom.fromPage == 'act'){
				//跳转到活动页面之前删除保存的from 信息
				wx.removeStorageSync('editFrom')
				wx.redirectTo({
					url:'/pages/details/detail?id='+userFrom.id
				})
			}
		}else if(userInfoComplete == 'tags'){
			// 跳转到填写标签页面,从第一页开始
			wx.navigateTo({
				url:'/pages/user/info/edit/tags',
				events:{
				},
				success(res){
					res.eventChannel.emit('tagType',{data:1,'method':1})
				}
			})
		}else if(userInfoComplete == 'uga'){
			// 跳转到填写uga 的页面从第一条开始
			
		}else if(userInfoComplete == 'baseInfo'){
			wx.navigateTo({
				url:'/pages/user/info/edit/edit'
			})
		}
	},
	//日期选择
	bindDateChange(e){
		console.log(e.detail.value)
		this.setData({
			birthDay:e.detail.value
		})
	}
})
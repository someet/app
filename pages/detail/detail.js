var WxParse = require('../wxParse/wxParse.js');
var req = require('../../common/request.js');
var user = require('../../common/user.js');
var util = require('../../utils/util.js');
var app = getApp();
Page({

	data: {
		id: 0,
		model: {},
		is_click: false,
		isShow: true,
		t: util.formatTime(1560417955),
		isLogin: 0,
		isCollect: 0, //是否收藏,
		isBlack: false, //是否拉黑,
		randAct: [],
		deviceInfo:{}
	},
	onLoad: function(options) {
		var deviceInfo = wx.getStorageSync('deviceInfo');
		this.setData({
			deviceInfo:deviceInfo
		})
		var act_id = options.id
		this.setData({
			id: act_id
		})
		this.checkLogin()
		this.getDetail()
		this.getRandAct()
	},
	onReady: function() {
		req.getHeader();
		var userInfo = user.getUserInfo()
	},
	goQrcode(e){
		var id = e.currentTarget.dataset.id
		wx.redirectTo({
			url: '/pages/detail/qrcode?id=' + id
		})
	},
	goDetail(e) {
		var id = e.currentTarget.dataset.id
		var page = getCurrentPages();
		if (page > 9) {
			wx.redirectTo({
				url: '/pages/detail/detail?id=' + id
			})
		} else {
			wx.navigateTo({
				url: '/pages/detail/detail?id=' + id
			})
		}

	},
	// 发布活动
	releaseAct() {
		var that = this
		app.loadMsg('正在发布...')
		req.releaseAct({
			'id': this.data.id
		}).then((res) => {
			console.log(res);
			app.hideLoad();
			if (res.data.status == 1) {
				app.showMsg('发布成功');
				var model = that.data.model
				model.status = 20
				that.setData({
					model: model
				})
			} else {
				app.showMsg(res.data);
			}

		})
	},
	// 随机获取三个活动
	getRandAct() {
		var id = this.data.id,
			that = this;
		req.getRandAct({
			'id': id
		}).then((res) => {
			console.log(res)
			var data = res.data
			if (data.status == 1) {
				that.setData({
					randAct: data.data
				})
			}
		})
	},
	// 收藏按钮
	collectAct(e) {
		var id = e.currentTarget.dataset.id
		console.log(id)
		this.setData({
			isCollect: Number(!this.data.isCollect)
		})
		var type;
		if(this.data.isCollect){
			type='collect'
		}else{
			type='uncollect'
		}
		var data = {
			cid:this.data.id,
			type:type
		}
		req.addCollect(data).then((res)=>{
			console.log(res)
			if(res.data.status == 1){
				var title = this.data.isCollect ? '已收藏' : '取消收藏';
				app.showMsg(title)
			}else{
				app.showMsg('操作失败')
			}
		})
	},
	// 拉黑按钮
	blackAct(e) {
		var id = e.currentTarget.dataset.id
		this.setData({
			isBlack: Number(!this.data.isBlack)
		})
		var type;
		if(this.data.isBlack){
			type='black'
		}else{
			type='white'
		}
		var data = {
			cid:this.data.id,
			type:type
		}
		req.addBlack(data).then((res)=>{
			console.log(res)
			if(res.data.status == 1){
				var title = this.data.isBlack ? '已拉黑' : '取消拉黑';
				app.showMsg(title)
			}else{
				app.showMsg('操作失败')
			}
		})
		
	},
	checkLogin() {
		var userInfo = wx.getStorageSync('userInfo')
		if (userInfo.id) {
			this.setData({
				isLogin: 1
			})
		}
	},
	getDetail: function() {
		wx.showLoading({
			title: '加载中',
		})
		var that = this;
		var data = {
			'id': this.data.id
		};
		req.getView(data).then((res) => {
			var detail = res.data;
			console.log(detail)
			WxParse.wxParse('content', 'html', detail.details, that, 0);
			WxParse.wxParse('review', 'html', detail.review, that, 0);
			WxParse.wxParse('field2', 'html', detail.field2, that, 0);
			WxParse.wxParse('field6', 'html', detail.field6, that, 0);
			that.setData({
					model: detail,
					isShow: false,
					t: util.formatTime(detail.start_time),
					isCollect: detail.is_collect,
					isBlack: detail.is_black
				}),
				console.log(this.model)
			wx.hideLoading()
		}).catch(req.showErr)
	},
	//获取订阅权限
	getAccessSub() {
		wx.requestSubscribeMessage({
			tmplIds: ['faq-S-jJKkgV_5eNg3Yf1qfZEu37b0RAVVr3MzrDG0Y'
			],
			success(res) {
				console.log(res)
			},
			fail(res) {
				console.log(res)
			},
			complete(res) {
				console.log(res)
			}
		})
	},
	//点击报名
	goAnswer: function(e) {
		var that = this;
		var userInfoComplete = user.checkUserInfoComplete()
		if (this.data.isLogin == 0 || !this.data.isLogin) {
			app.showMsg('请先登录')
			wx.setStorageSync('editUserFrom', {
				'fromPage': 'act',
				id: that.data.id
			})
			wx.switchTab({
				'url': '/pages/user/user'
			})
			return false
		}
		if (userInfoComplete != 'complete') {
			wx.setStorageSync('editUserFrom', {
				'fromPage': 'act',
				id: that.data.id
			})
			app.showMsg('请先完善信息')
			var item = wx.getStorageSync('userInfoComplete'),
				url;
			url = '/pages/user/info/edit/edit'
			wx.redirectTo({
				url: url
			})
			return false
		}
		if (this.data.model.is_answer) return false;
		this.is_click = true;
		//检查自身的状态，是否填写了手机号，微信号
		//检查活动状态
		var title;
		if (this.data.model.status == 20) {
			this.checkAnswer(e.detail.formId);
		} else {
			if (this.data.model.status == 30) {
				title = '活动已关闭';
			}
			if (this.data.model.status == 40) {
				title = '活动已取消';
			}
			wx.showToast({
				title: title,
				icon: 'none',
				duration: 2000
			})
		}
	},
	goback() {
		wx.navigateBack({
			delta: 1
		})
	},
	//判断活动状态
	checkAnswer(formId) {
		var that = this;
		wx.showLoading({
			title: '查询报名状态中',
		})
		var data = {
			'id': this.data.id
		};
		req.checkAnswer(data).then((res) => {
			wx.hideLoading();
			var title = '可以报名';
			if (res.success == 0) title = '服务器错误';
			if (res.data.status !== 1) {
				if (res.data == 'is_not_complete') {
					title = '请先完善个人信息';
					app.showMsg(title);
					//跳转到修改个人信息页面
					//查询缓存里的未完成的信息
					var item = wx.getStorageSync('userInfoComplete'),
						url;
					url = '/pages/user/info/edit/edit'
					wx.redirectTo({
						url: url
					})
					return false;
				}
				if (res.data == 'is_empty') {
					title = '活动查询失败';
				}
				if (res.data == 'is_full') {
					title = '报名人数已满';
				}
				if (res.data == 'is_conflict') {
					title = '报名活动冲突';
				}
				if (res.data == 'not_release') {
					title = '活动尚未发布';
				}
				if (res.data == 'is_answer') {
					title = '活动已报名';
				}
				wx.showToast({
					title: title,
					icon: 'none',
					duration: 2000
				})
				that.is_click = false;
			} else {
				//开始报名
				that.startAnswer(res.data.is_set_question, formId)
			}
		}).catch(req.showErr)
	},
	startAnswer(is_set_question, formId) {
		if(deviceInfo && deviceInfo.SDKVersion > '2.8.2'){
			console.log('版本足够')
		}
		//保存formId，发布消息
		var data = {
			formId: formId,
			activity_id: this.data.id,
			content: '报名'
		}
		req.saveFormId(data).then((res) => {
			console.log(res)
		}).catch(req.showErr)
		// 开始报名流程
		console.log('开始了')
		// return false
		var that = this;
		if (is_set_question) {
			//跳转到回答问题页面
			wx.navigateTo({
				url: '/pages/question/index?id=' + this.data.id,
				events: {

				},
				success(res) {
					var founderInfo = {
						headimgurl: that.data.model.profile.headimgurl,
						username: that.data.model.user.username
					}
					console.log(founderInfo)
					res.eventChannel.emit('founderInfo', {
						data: founderInfo
					})
				},
				fail(res){
					console.log(res)
				}
			})
		} else {
			console.log('到这了')
			req.startAnswer().then((res) => {
				console.log(res)
				if (res.success == 0) {
					wx.showToast({
						title: '服务器错误',
						icon: 'none',
						duration: 2000
					})
					that.is_click = false;
				} else {
					if (res.data.status == 1) {
						if (typeof(res.data.is_set_question) != undefined && res.data.is_set_question == 1) {
							//跳转回答问题页面
							wx.navigateTo({
								url: '/pages/question/index?id=' + that.data.id,
								events: {
								
								},
								success(res) {
									var founderInfo = {
										headimgurl: that.data.model.profile.headimgurl,
										username: that.data.model.user.username
									}
									console.log(founderInfo)
									res.eventChannel.emit('founderInfo', {
										data: founderInfo
									})
								}
							})
						} else {
							//未设置问题则直接生成报名记录
							console.log(res)
							that.is_click = false;
							if (res.data.status == 1) {
								//跳转到报名成功页面
								wx.redirectTo({
									url: '/pages/user/answer/finish/finish'
								})
							}
						}
					}
				}
			});
		}
	}
})

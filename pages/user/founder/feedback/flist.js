var req = require('../../../../common/request.js');
var util = require('../../../../utils/util.js'); 
var userFunc = require('../../../../common/user.js')
var app = getApp()
Page({
	data: {
		id: 0,
		fInfo:'',
		userInfo:{
		}
	},
	onLoad(options) {
		console.log(options)
		var id = options.id
		this.setData({
			id:id
		})
		var that = this
		console.log(id)
		this.getFeedBackAnswers();
	},
	//获取该活动信息
	getFeedBackAnswers(){
		var that = this
		app.loadTitle('获取数据...')
		req.getFeedBackAnswers({'id':this.data.id}).then((res)=>{
			app.hideLoad()
			console.log(res)
			var data = res.data
			if(data.status == 1){
				that.setData({
					fInfo:data.data
				})
			}
		})
	},
	checkUserInfo() {
		var userInfo = userFunc.getUserInfo()
		console.log(userInfo)
		if (typeof(userInfo.id) == 'undefined' || userInfo.length == 0) {
			app.showMsg('登录过期')
			this.setData({
				userInfo: {
					'id': 0
				}
			})
			return false;
		}
		return true;
	},
	// 去筛选「
	goFilter(e) {
		if (!this.checkUserInfo()) {
			app.showMsg('请重新登录')
			return false;
		}
		const val = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/user/founder/filter',
			events: {
	
			},
			success: function(res) {
				res.eventChannel.emit('actInfo', {
					data: val
				})
			}
		})
	}
})

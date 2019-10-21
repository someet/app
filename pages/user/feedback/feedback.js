var req = require('../../../common/request.js');
var util = require('../../../utils/util.js'); 
var app = getApp()
Page({
	data: {
		id: 0,
		goodUser: 0,
		badUser: 0,
		goodUnselect: [],
		badUnselect: [],
		act:[]
	},
	onLoad() {
		var that = this
		// actInfo
		const eventChannel = that.getOpenerEventChannel()
		eventChannel.on('actInfo', function(data) {
			console.log(data)
			that.setData({
				id: data.id,
			})
		});
		this.getAnswers()
	},
	//获取所有的正常参与的用户
	getAnswers() {
		app.loadTitle('获取报名用户')
		var data = {
			'activity_id': this.data.id,
		}
		var that = this
		req.getFeedBackAnswer(data).then((res) => {
			console.log(res)
			if (res.data.status == 1) {
				var act = res.data.act
				act.time = util.formatTimeSingle(act.start_time) + '-' + util.formatTimeSingle(act.end_time)
				that.setData({
					goodUnselect: res.data.data,
					badUnselect: res.data.data,
					act:act
				})
			}
			app.hideLoad()
		})
	},
	selectGoodUser(e) {
		var selectedId = e.currentTarget.dataset.id
		console.log(selectedId)
		if (this.data.goodUser != 0) selectedId = 0
		this.setData({
			goodUser: selectedId
		})
	},
	selectBadUser(e) {
		var selectedId = e.currentTarget.dataset.id
		console.log(selectedId)
		if (this.data.badUser != 0) selectedId = 0
		this.setData({
			badUser: selectedId,
		})
	},
	feedbackSubmit(e) {
		console.log(e)
		if (this.data.isClick) {
			app.showMsg('请稍后')
			return false;
		}
		this.setData({
			isClick: true
		})
		var data = {
			'feedback': e.detail.value.feedback,
			'good_user': this.data.goodUser,
			'bad_user': this.data.badUser,
			'activity_id': this.data.id,
		}
		var that = this
		console.log(data)
		app.loadTitle('请稍后')
		req.addFounderFeedback(data).then((res) => {
			if(res.status == 1){
				app.hideLoad()
				wx.navigateBack({
					delta:1
				})
			}else{
				app.showMsg(res.data.data)
				that.setData({
					isClick: false
				})
			}
		})
	}

})

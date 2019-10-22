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
		act: [],
		badReason: [{
			id: 1,
			reason: [{
					'title': '活动文案夸大了实际效果',
					'checked': false,
					'id': 1
				},
				{
					'title': '活动具体执行效果没有达到预期',
					'checked': false,
					'id': 2
				},
				{
					'title': '活动流程有变动，没有提前跟用户沟通',
					'checked': false,
					'id': 3
				},
				{
					'title': '活动文案和实际内容不是一回事',
					'checked': false,
					'id': 4
				},
			],
			title: "活动与预期不符"
		}],
		selectReason: false,
		showDetail: false,
		selectedBadId: [], //已经选择的不好的理由,
		currentBadId:[]
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
		console.log(this.data.badReason)
		this.getAnswers()
		this.getBadReason()
	},
	//获取所有坏理由
	getBadReason() {
		var that = this
		var data = {
			id: this.data.id
		}
		req.getBadReason(data).then((res) => {
			console.log(res) //
			//设置数据
			that.setData({
				badReason: res.data.data
			})

		})
	},
	checkboxChange(e) {
		var index = e.currentTarget.dataset.index
		console.log(index)
		var selectReason = this.data.selectReason
		var reason = selectReason.reason
		reason[index].checked = !reason[index].checked
		selectReason.reason = reason
		this.setData({
			selectReason: selectReason,
		})
	},
	//点击不好的理由
	selectReason(e) {
		var index = e.currentTarget.dataset.index
		var id = e.currentTarget.dataset.id
		var badReason = this.data.badReason[index]
		var allReason = this.data.badReason
		allReason[index].checked = true;
		//检查是否已经插入已选择列表va
		if (this.data.selectedBadId.indexOf(id) == -1) {
			var selectedBadId = this.data.selectedBadId
			selectedBadId.push(id)
			this.setData({
				selectedBadId: selectedBadId
			})
			console.log(this.data.selectedBadId)
		}
		this.setData({
			badReason: allReason,
			selectReason: badReason,
			showDetail: true,
		})
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
					act: act
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
			if (res.status == 1) {
				app.hideLoad()
				wx.navigateBack({
					delta: 1
				})
			} else {
				app.showMsg(res.data.data)
				that.setData({
					isClick: false
				})
			}
		})
	},
	//提交理由反馈
	reasonChildSubmit(e) {
		var other_reason = e.detail.value.content
		console.log(e)
		console.log(other_reason)
	},
	hideDetail() {
		this.setData({
			showDetail: false
		})
		// if()
	},
	badReasonChildChange:function(e) {
		//需要检验取消选定的删除情况
		var data = e.detail.value[0]
		var res = data.split('-')
		console.log(res)
		//pid是1，ID是 0
		var currentBadId = this.data.currentBadId
		//push 入currentBadId
		currentBadId.push({
			pid:res[1],
			id:res[0]
		})
		console.log(currentBadId)
	}
})
